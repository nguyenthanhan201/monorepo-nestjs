// import { HttpService } from '@nestjs/common'

// class VietmapApiHelper {
//   constructor(private httpService: HttpService) {}

//   private callApi(url: string) {
//     return new Promise((resolve) => {
//       this.httpService
//         .get(url)
//         .toPromise()
//         .then((res) => {
//           resolve(res.data.Data)
//         })
//         .catch((err) => {
//           console.log(err)
//           throw err
//         })
//     })
//   }

//   /** Lấy danh sách xe trên hệ thống VietMap */
//   public async getVehicle() {
//     const url = `https://client-api.quanlyxe.vn/v3/tracking/getvehicles?apikey=${process.env.APIKEY_VIETMAP}`
//     return await this.callApi(url)
//   }

//   /** Lấy lịch sử hành trình xe trên hệ thống VietMap */
//   public async getVehicleHistory(id: number, from: string, to: string) {
//     const url = `https://client-api.quanlyxe.vn/v3/tracking/getvehiclehistory?id=${id}&from=${from}&to=${to}&apikey=${process.env.APIKEY_VIETMAP}`
//     return await this.callApi(url)
//   }

//   /** Lấy trạng thái tức thì của xe */
//   public async getVehicleStatus(plate: string) {
//     const url = `https://client-api.quanlyxe.vn/v3/tracking/GetVehicleStatus?plate=${plate}&apikey=${process.env.APIKEY_VIETMAP}`
//     return await this.callApi(url)
//   }

//   // Các api vietmap khác
//   // GetVehicleImages: `https://client-api.quanlyxe.vn/v3/tracking/getvehicleimages?id={0}&from={1}&to={2}&apikey={3}`,
//   // GetDailyReports: `https://client-api.quanlyxe.vn/v3/tracking/GetDailyReports?id={0}&from={1}&to={2}&apikey={3}`,
//   // GetVehiclePointReports: `https://client-api.quanlyxe.vn/v3/tracking/GetVehiclePointReports?id={0}&from={1}&to={2}&apikey={3}`,
//   // GetVehicleTollgateReports: `https://client-api.quanlyxe.vn/v3/tracking/GetVehicleTollgateReports?id={0}&from={1}&to={2}&apikey={3}`,
//   // GetVehicleShiftReports: `https://client-api.quanlyxe.vn/v3/tracking/GetVehicleShiftReports?id={0}&from={1}&to={2}&apikey={3}`,
//   // GetVehicleStopReports: `https://client-api.quanlyxe.vn/v3/tracking/GetVehicleStopReports?id={0}&from={1}&to={2}&apikey={3}`,
// }

// export default new VietmapApiHelper(new HttpService())
