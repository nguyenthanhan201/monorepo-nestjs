import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LiveStream, LiveStreamDocument } from './live-stream.model';

@Injectable()
export class LiveStreamService {
  constructor(
    @InjectModel(LiveStream.name)
    private readonly liveStreamModel: Model<LiveStreamDocument>,
    private httpService: HttpService,
  ) {}

  async createNewRoomId(): Promise<any> {
    const result = await this.httpService
      .post(
        'https://api.100ms.live/v2/rooms',
        {
          // name: 'new-room-1662723668',
          // description: 'This is a sample description for the room',
          template_id: '65bb153ecd666ed1654e220f',
        },
        {
          headers: {
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MDY4NzM0NTcsImV4cCI6MTcwNjk1OTg1NywianRpIjoiand0X25vbmNlIiwidHlwZSI6Im1hbmFnZW1lbnQiLCJ2ZXJzaW9uIjoyLCJuYmYiOjE3MDY4NzM0NTcsImFjY2Vzc19rZXkiOiI2MzQ5NjJhN2UwODg2M2EzZjJmOGU3ZDAifQ.ImZSc5ibnquqRim31lTZtSlGx4ns8_zZqcO0wbvLG1w`,
          },
        },
      )
      .toPromise()
      .then((res) => {
        // console.log('👌  res:', res);
        return res.data.id;
      })
      .catch((err) => {
        // console.log(
        //   '🚀 ~ file: live-stream.service.ts ~ line 39 ~ LiveStreamService ~ createNewRoomId ~ err',
        //   err,
        // );
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      });

    return result;
  }

  async getLiveStreamByUserId(userId: Types.ObjectId): Promise<any> {
    const getRoomIdByUserId = await this.liveStreamModel
      .findOne({
        userId,
      })
      .exec();

    if (!getRoomIdByUserId) {
      const newRoomId = await this.createNewRoomId();

      const newLiveStream = new this.liveStreamModel({
        userId,
        roomId: newRoomId,
      });

      await newLiveStream.save();

      return newLiveStream;
    }

    return getRoomIdByUserId;
  }

  async getAllRooms(): Promise<LiveStream[]> {
    const result = await this.liveStreamModel.find().exec();
    console.log('👌  result:', result);
    return result;
  }
}
