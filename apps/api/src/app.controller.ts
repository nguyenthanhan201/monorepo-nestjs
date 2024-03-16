import { Controller, Post } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  // Note: This would be done already from the main Facebook App thus simple end point provided to simplify this process.
  @Post('add-friend/:friendId')
  async addFriend() {
    return 'add-friend-2';
  }
}
