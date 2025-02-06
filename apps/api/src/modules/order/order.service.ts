import { HttpService } from "@nestjs/axios";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as crypto from "crypto";
import * as CryptoJS from "crypto-js";
import * as dateFormat from "date-format";
import { Request, Response } from "express";
import * as ip from "ip";
import { Model, Types } from "mongoose";
import configVNPay from "../../config/configVNPay";
import { CartItem, CartItemDocument } from "../cart-item/cart-item.model";
import { Product, ProductDocument } from "../product/product.model";
import { RatingService } from "../rating/rating.service";
import { OrderCreatePaymentDto } from "./dto/OrderCreatePayment.dto";
import { ItemOrder, ItemOrderDocument } from "./itemOrder.model";
import { Order, OrderDocument } from "./order.model";

interface MomoPaymentUrlResponse {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl: string;
  deeplink: string;
  qrCodeUrl: string;
}

interface ZalopayPaymentUrlResponse {
  return_code: number;
  return_message: string;
  sub_return_code: number;
  sub_return_message: string;
  zp_trans_token: string;
  order_url: string;
  order_token: string;
  qr_code: string;
}

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
    private readonly ratingService: RatingService,
    private readonly httpService: HttpService
  ) {}

  async getAllOrders() {
    return this.orderModel.find().sort({ createdAt: -1 });
  }

  async getOrdersByIdAuth(idAuth: Types.ObjectId) {
    // get orders have idAuth = id and sort by date
    return this.orderModel
      .find({ idAuth })
      .sort({ createdAt: -1 })
      .then((orders) => orders)
      .catch((err) => err);
  }

  async createPaymentUrl(bodyData: OrderCreatePaymentDto): Promise<{
    data: string;
  }> {
    // check xem có itemCart nào không đủ số lượng
    if (!this.isCartItemsValid(bodyData.cartItems)) return;

    switch (bodyData.paymentType) {
      case "vnpay":
        return this.createPaymentUrlVNPay(bodyData);
      case "momo":
        return this.createPaymentUrlMoMo(bodyData);
      case "zalopay":
        return this.createPaymentUrlZaloPay(bodyData);
      default:
        return { data: "Payment type is invalid" };
    }
  }

  async isCartItemsValid(cartItems: any) {
    if (Object.values(cartItems).length === 0) return true;

    const promises = Object.values(cartItems).map((item) => {
      const result = new Promise((resolve, reject) => {
        this.productModel.findById(item[0].idProduct._id).then((product) => {
          if (product.stock < item[0].quantity)
            return resolve("Sản phẩm " + product.title + " không đủ số lượng");
          return resolve(true);
        });
      });
      return result;
    });

    const results = await Promise.all(promises);

    const isValid = results.every((item) => item === true);

    if (isValid) return true;
    else {
      const itemDifferent = results.filter((item) => item !== true);
      throw new HttpException(itemDifferent[0], 400);
    }
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

  async addOrder(req: Request, res: Response, idAuth: Types.ObjectId) {
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

  async createPaymentUrlVNPay(
    bodyData: OrderCreatePaymentDto
  ): Promise<{ data: string }> {
    var ipAddr = ip.address();
    var tmnCode = configVNPay.vnp_TmnCode;
    var secretKey = configVNPay.vnp_HashSecret;
    var vnpUrl = configVNPay.vnp_Url;
    var returnUrl = process.env.VNP_RETURNURL;
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

    return { data: vnpUrl };
  }

  async createPaymentUrlMoMo(
    bodyData: OrderCreatePaymentDto
  ): Promise<{ data: string }> {
    //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    //parameters
    //parameters
    var partnerCode = "MOMO";
    var accessKey = "F8BBA842ECF85";
    var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    var requestId = partnerCode + new Date().getTime();
    var orderId = requestId;
    var orderInfo = "pay with MoMo";
    var redirectUrl = process.env.VNP_RETURNURL;
    var ipnUrl = "https://callback.url/notify";
    // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
    var amount = "50000";
    var requestType = "captureWallet";
    // var requestType = "payWithMethod";
    var extraData = ""; //pass empty value if your merchant does not have stores

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature =
      "accessKey=" +
      accessKey +
      "&amount=" +
      amount +
      "&extraData=" +
      extraData +
      "&ipnUrl=" +
      ipnUrl +
      "&orderId=" +
      orderId +
      "&orderInfo=" +
      orderInfo +
      "&partnerCode=" +
      partnerCode +
      "&redirectUrl=" +
      redirectUrl +
      "&requestId=" +
      requestId +
      "&requestType=" +
      requestType;
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------");
    console.log(rawSignature);
    //signature
    const crypto = require("crypto");
    var signature = crypto
      .createHmac("sha256", secretkey)
      .update(rawSignature)
      .digest("hex");
    console.log("--------------------SIGNATURE----------------");
    console.log(signature);

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      accessKey: accessKey,
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: "vi",
    });
    //Create the HTTPS objects
    // const https = require("https");
    // const options = {
    //   hostname: "test-payment.momo.vn",
    //   port: 443,
    //   path: "/v2/gateway/api/create",
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Content-Length": Buffer.byteLength(requestBody),
    //   },
    // };
    // //Send the request and get the response
    // const req = https.request(options, (res) => {
    //   console.log(`Status: ${res.statusCode}`);
    //   console.log(`Headers: ${JSON.stringify(res.headers)}`);
    //   res.setEncoding("utf8");
    //   res.on("data", (body) => {
    //     console.log("Body: ");
    //     console.log(body);
    //     console.log("payUrl: ");
    //     console.log(JSON.parse(body).payUrl);
    //   });
    //   res.on("end", () => {
    //     console.log("No more data in response.");
    //   });
    // });

    // req.on("error", (e) => {
    //   console.log(`problem with request: ${e.message}`);
    // });
    // // write data to request body
    // console.log("Sending....");
    // req.write(requestBody);
    // req.end();

    try {
      const res = this.httpService

        .post<MomoPaymentUrlResponse>(
          "https://test-payment.momo.vn/v2/gateway/api/create",
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
              "Content-Length": Buffer.byteLength(requestBody),
            },
          }
        )
        .toPromise();
      console.log("👌  res:", (await res).data);

      return {
        data: (await res).data.payUrl,
      };
    } catch (error) {
      throw new HttpException(
        "Create payment url fail",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async createPaymentUrlZaloPay(
    bodyData: OrderCreatePaymentDto
  ): Promise<{ data: string }> {
    const config = {
      app_id: "2553",
      key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
      key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
      endpoint: "https://sb-openapi.zalopay.vn/v2/create",
    };

    const embed_data = {
      //sau khi hoàn tất thanh toán sẽ đi vào link này (thường là link web thanh toán thành công của mình)
      redirecturl: process.env.VNP_RETURNURL,
    };

    const items = [];
    const transID = Math.floor(Math.random() * 1000000);

    const order = {
      app_id: config.app_id,
      app_trans_id: `080724_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: "user123",
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: bodyData.amount,
      //khi thanh toán xong, zalopay server sẽ POST đến url này để thông báo cho server của mình
      //Chú ý: cần dùng ngrok để public url thì Zalopay Server mới call đến được
      callback_url: "https://b074-1-53-37-194.ngrok-free.app/callback",
      description: `Yolo - Payment for the order #${transID}`,
      bank_code: "",
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
      config.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;
    (order as any).mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
      const res = this.httpService
        .post<ZalopayPaymentUrlResponse>(config.endpoint, null, {
          params: order,
        })
        .toPromise();

      return {
        data: (await res).data.order_url,
      };
    } catch (error) {
      throw new HttpException(
        "Create payment url fail",
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
