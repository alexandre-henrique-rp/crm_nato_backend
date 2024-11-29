import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ChamadoService } from './chamado.service';

@Controller('chamado')
export class ChamadoController {
  constructor(private chamadoService: ChamadoService) {}

  @Post('/create')
  create(@Body() data: any) {
    return 'chamado'
  }

  @Get()
  getAll() {
    return 'chamado'
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return 'chamado'
  }

  @Get()
  search(@Query() pesquisa: any) {
    const {all} = pesquisa
    return 'chamado'
  }

}
