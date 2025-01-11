import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { NowService } from './now.service';
import { CreateNowDto } from './dto/create_now.dto';

@Controller('now')
export class NowController {
  constructor(private readonly nowService: NowService) {}

  @Get("/:id")
  async get(@Param('id') id: number) {
    return this.nowService.GetUpdate(id)
  }
  @Put("/:id")
  async post(@Param('id') id: number, @Body() data: CreateNowDto) {
    return this.nowService.GetCreate(id, data)
  }
  
}
