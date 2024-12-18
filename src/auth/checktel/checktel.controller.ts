import { Controller, Get, Param } from '@nestjs/common';
import { ChecktelService } from './checktel.service';

@Controller('checktel')
export class ChecktelController {
  constructor(private readonly checktelService: ChecktelService) {}

  @Get('/:tell')
  async getTell(@Param('tell') tell: string) {
    return await this.checktelService.getTell(tell);
  }
}
