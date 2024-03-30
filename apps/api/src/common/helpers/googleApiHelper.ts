// import { HttpService } from '@nestjs/common'

// class GoogleApiHelper {
//   constructor(private httpService: HttpService) {}

//   private async callApi(url: string) {
//     return new Promise((resolve) => {
//       this.httpService
//         .get(url)
//         .toPromise()
//         .then((res) => {
//           resolve(res.data.results)
//         })
//         .catch((err) => {
//           console.log(err)
//           throw err
//         })
//     })
//   }

//   private async callApiDistance(url: string) {
//     return new Promise((resolve) => {
//       this.httpService
//         .get(url)
//         .toPromise()
//         .then((res) => {
//           console.log(JSON.stringify(res.data))
//           resolve(res.data.rows)
//         })
//         .catch((err) => {
//           console.log(err)
//           throw err
//         })
//     })
//   }

//   /** Lấy tọa độ latlng từ địa chỉ */
//   public async getLatLngFromAddress(address: string) {
//     const encodeAddress = encodeURIComponent(address)
//     const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeAddress}&key=${process.env.APIKEY_GOOGLE}`
//     const res: any = await this.callApi(url)

//     if (res == null || res.length == 0) return null
//     if (res.length > 0) {
//       console.log(res[0].geometry.location)
//       return res[0].geometry.location
//     }
//   }

//   /** Lấy địa chỉ từ tọa độ latlng */
//   public async getAddressFromLatLng(lat: number, lng: number) {
//     const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.APIKEY_GOOGLE}`
//     const res: any = await this.callApi(url)

//     if (res == null || res.length == 0) return null
//     if (res.length > 0) {
//       console.log(res[0].formatted_address)
//       return res[0].formatted_address
//     }
//   }

//   /** Lấy distance (trả về mét) */
//   public async getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
//     const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat1}%2C${lng1}&destinations=${lat2}%2C${lng2}&key=${process.env.APIKEY_GOOGLE}`
//     const res: any = await this.callApiDistance(url)

//     if (res == null || res.length == 0) return null
//     if (res.length > 0) {
//       console.log(res[0].elements)
//       if (res[0].elements && res[0].elements.length > 0) {
//         const met = res[0].elements[0].distance.value
//         return met
//       }
//     }
//   }
// }

// export default new GoogleApiHelper(new HttpService())
