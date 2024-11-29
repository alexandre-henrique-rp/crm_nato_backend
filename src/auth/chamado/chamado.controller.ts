import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ChamadoService } from './chamado.service';
import { CreateChamadoDto } from './dto/create_chamado.dto';

@Controller('chamado')
export class ChamadoController {
  constructor(private chamadoService: ChamadoService) {}

  @Post('/create')
  create(@Body() data: CreateChamadoDto, @Req() req: any) {
    try{
      return this.chamadoService.create(data, req.user)
    } catch (error) {
      return error
    }
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
