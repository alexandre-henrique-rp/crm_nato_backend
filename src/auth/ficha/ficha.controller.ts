import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FichaService } from './ficha.service';
import { AuthGuard } from '../auth.guard';
@UseGuards(AuthGuard)
@Controller('ficha')
export class FichaController {
  constructor(private fichaService: FichaService ) { }

  @Post('/')
  async create(@Body() data: any) {
    return this.fichaService.CreateFicha(data)
  } 

  @Post('/create')
  async get(@Body() data: any, @Req() req: any) {
    const id = Number(data.id)
    return this.fichaService.GetUpdate(id, req.user)
  }
}

