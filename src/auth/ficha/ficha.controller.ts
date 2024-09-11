import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FichaService } from './ficha.service';

@Controller('ficha')
export class FichaController {
  constructor(private fichaService: FichaService ) { }

  @Post('/')
  async create(@Body() data: any) {
    return this.fichaService.CreateFicha(data)
  } 

  @Get('/:id_solicitacao')
  async get(@Param('id_solicitacao') id_solicitacao: number) {
    const id = Number(id_solicitacao)
    return this.fichaService.GetUpdate(id)
  }
}

