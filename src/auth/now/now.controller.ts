import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { NowService } from './now.service';

@Controller('now')
export class NowController {
  constructor(private readonly nowService: NowService) {}

  @Get("/:id")
  async get(@Param('id') id: number) {
    return this.nowService.GetUpdate(id)
  }
  @Post("/")
  async post(@Body() data: any) {
    return this.nowService.GetCreate(data)
  }

}
