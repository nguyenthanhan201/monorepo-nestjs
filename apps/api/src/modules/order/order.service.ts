import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as crypto from "crypto";
import * as ip from "ip";
import { Model } from "mongoose";
import configVNPay from "../../config/configVNPay";
import { CartItem, CartItemDocument } from "../cart-item/cart-item.model";
import { Product, ProductDocument } from "../product/product.model";
import { RatingService } from "../rating/rating.service";
import { OrderCreatePaymentDto } from "./dto/OrderCreatePayment.dto";
import { ItemOrder, ItemOrderDocument } from "./itemOrder.model";
import { Order, OrderDocument } from "./order.model";

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(ItemOrder.name)
    private readonly itemOrderModel: Model<ItemOrderDocument>,
    @InjectModel(CartItem.name)
    private readonly cartItemModel: Model<CartItemDocument>,
    private readonly ratingService: RatingService
  ) {}

  async getAllOrders() {
    return this.orderModel.find().sort({ createdAt: -1 });
  }

  async getOrdersByIdAuth(idAuth: string) {
    // get orders have idAuth = id and sort by date
    return this.orderModel
      .find({ idAuth })
      .sort({ createdAt: -1 })
      .then((orders) => orders)
      .catch((err) => err);
  }

  async createPaymentUrl(bodyData: OrderCreatePaymentDto) {
    const mapLoop = async () => {
      // check xem có itemCart nào không đủ số lượng
      const promises = await Object.values(bodyData.cartItems).map((item) => {
        const result = new Promise((resolve, reject) => {
          this.productModel.findById(item[0].idProduct._id).then((product) => {
            if (product.stock < item[0].quantity)
              return resolve(
                "Sản phẩm " + product.title + " không đủ số lượng"
              );
            return resolve(true);
          });
        });
        return result;
      });
      const results = await Promise.all(promises);

      // nếu có sản phẩm nào không đủ số lượng thì trả về thông báo, còn đủ thì trả về urlVNPay
      if (results.every((item) => item === true)) {
        var ipAddr = ip.address();
        var dateFormat = require("date-format");
        var tmnCode = configVNPay.vnp_TmnCode;
        var secretKey = configVNPay.vnp_HashSecret;
        var vnpUrl = configVNPay.vnp_Url;
        var returnUrl = `${process.env.VNP_RETURNURL}order/vnpay_return`;
        var date = new Date();
        var createDate =
          date.getFullYear() +
          "" +
          ("0" + (date.getMonth() + 1)).slice(-2) +
          "" +
          ("0" + date.getDate()).slice(-2) +
          "" +
          ("0" + date.getHours()).slice(-2) +
          "" +
          ("0" + date.getMinutes()).slice(-2) +
          "" +
          ("0" + date.getSeconds()).slice(-2);
        var orderId = dateFormat(date, "HHmmss");
        var amount = bodyData.amount;
        // var bankCode = "NCB";
        var bankCode = "";
        var orderInfo = "Thanh toan don hang";
        var orderType = "other";
        var locale = "vn";
        if (locale === null || locale === "") {
          locale = "vn";
        }
        var currCode = "VND";
        var vnp_Params = {};
        vnp_Params["vnp_Version"] = "2.1.0";
        vnp_Params["vnp_Command"] = "pay";
        vnp_Params["vnp_TmnCode"] = tmnCode;
        vnp_Params["vnp_Locale"] = locale;
        vnp_Params["vnp_CurrCode"] = currCode;
        vnp_Params["vnp_TxnRef"] = orderId;
        vnp_Params["vnp_OrderInfo"] = orderInfo;
        vnp_Params["vnp_OrderType"] = orderType;
        vnp_Params["vnp_Amount"] = amount * 100;
        vnp_Params["vnp_ReturnUrl"] = returnUrl;
        vnp_Params["vnp_IpAddr"] = ipAddr;
        vnp_Params["vnp_CreateDate"] = createDate;
        if (bankCode !== null && bankCode !== "") {
          vnp_Params["vnp_BankCode"] = bankCode;
        }
        vnp_Params = this.sortObject(vnp_Params);
        var querystring = require("qs");
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var hmac = crypto.createHmac("sha512", secretKey);
        // var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
        var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;
        vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
        if (!bodyData.amount)
          throw new HttpException("Amount is required", 400);
        return { data: vnpUrl };
      } else {
        const itemDifferent = results.filter((item) => item !== true);
        throw new HttpException(itemDifferent[0], 400);
      }
    };

    return mapLoop();
  }

  vnpayReturn(req, res) {
    var vnp_Params = req.query;
    // console.log("👌 ~ vnp_Params", vnp_Params);
    var secureHash = vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];
    vnp_Params = this.sortObject(vnp_Params);

    // var config = require('../../config/default.json');
    var config = configVNPay;
    var secretKey = config.vnp_HashSecret;
    var querystring = require("qs");
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    if (secureHash === signed) {
      res.json({ RspCode: "00", Message: "Confirm Success" });
    } else {
      res.json({ RspCode: "97", Message: "Confirm Fail" });
    }
  }

  vnpayIPN(req, res, next) {
    var vnp_Params = req.query;
    var secureHash = vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];
    vnp_Params = this.sortObject(vnp_Params);

    // var config = require('../../config/default.json');
    var config = configVNPay;
    var secretKey = config.vnp_HashSecret;
    var querystring = require("qs");
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    if (secureHash === signed) {
      res.json({ RspCode: "00", Message: "Confirm Success2" });
    } else {
      res.json({ RspCode: "97", Message: "Confirm Fail" });
    }
  }

  async addOrder(req, res) {
    const { idAuth } = req.body;

    // tìm cartItem của user
    return this.cartItemModel
      .find({
        idAuth,
      })
      .populate("idProduct")
      .then((cartItems) => {
        if (cartItems.length === 0)
          throw new HttpException("Cart is empty", HttpStatus.BAD_REQUEST);

        // gom nhóm các sản phẩm giống nhau
        const grouped = {};
        cartItems.forEach((a: any) => {
          const itemOrder = new this.itemOrderModel({
            product: a.idProduct,
            price: a.idProduct.price,
            quantity: a.quantity,
            size: a.size,
            color: a.color,
          });
          if (grouped[a.idProduct._id + a.size + a.color]) {
            grouped[a.idProduct._id + a.size + a.color][0].quantity +=
              a.quantity;
          } else {
            grouped[a.idProduct._id + a.size + a.color] = [itemOrder];
          }
        });

        // tạo order
        const order = new this.orderModel({
          idAuth,
          order: grouped,
        });

        try {
          //lưu order
          order.save().then(async (orderResult) => {
            // update số lượng sản phẩm và sô lượng bán
            const promises = await Object.values(orderResult.order).map(
              (item) => {
                const result = new Promise((resolve) => {
                  this.productModel
                    .findOneAndUpdate(
                      { _id: item[0].product._id },
                      {
                        $inc: {
                          stock: -item[0].quantity,
                          sold: +item[0].quantity,
                        },
                      }
                    )
                    .then(async () => {
                      await this.ratingService
                        .createRating({
                          idAuth,
                          idProduct: item[0].product._id,
                        })
                        .then(() => resolve(true));
                    })
                    .catch((err) => {
                      console.log("👌 ~ err", err);
                      resolve(false);
                    });
                });

                return result;
              }
            );

            const results = await Promise.all(promises);
            console.log("👌 ~ results", results);

            if (results.every((item) => item === true)) {
              // lưu order thành công thì xóa cartItem
              this.cartItemModel
                .deleteMany({
                  idAuth,
                })
                .then(
                  () => res.json({ message: "Order success" })
                  // RedisController.deletePromise({ key: 'order' }).then(() =>
                  //   res.json({ message: 'Order success' }),
                  // ),
                );
            } else {
              res.status(400).json({ message: "Order fail" });
            }
          });
        } catch (err) {
          return res.status(400).json({ error: err });
        }
      });
  }
  sortObject(obj) {
    var sorted = {};
    var str = [];
    var key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  }
}
