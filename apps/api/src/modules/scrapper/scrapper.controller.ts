import { Controller, Get } from '@nestjs/common';
import { ScrapperService } from './scrapper.service';

@Controller('scrapper')
export class ScrapperController {
  constructor(private scrapperService: ScrapperService) {}

  @Get()
  scrapperController() {
    return this.scrapperService.getDataViaPuppeteer();
  }
}
