import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  // UseGuards,
} from '@nestjs/common';
import { ChamadoService } from './chamado.service';
import { CreateChamadoDto } from './dto/create_chamado.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateChamadoDto } from './dto/update_chamado.dto';
import { ReadByIdChamadoDto } from './dto/read_by_id_chamado.dto';
// import { AuthGuard } from '../auth.guard';

// @UseGuards(AuthGuard)
@Controller('chamado')
@ApiTags('chamado')
export class ChamadoController {
  constructor(private chamadoService: ChamadoService) {}

  @Post('/create')
  async Create(@Body() data: CreateChamadoDto): Promise<ReadByIdChamadoDto> {
    try {
      console.log('🚀 ~ ChamadoController ~ Create ~ data:', data);
      const req = this.chamadoService.create(data);
      console.log('🚀 ~ ChamadoController ~ Create ~ req:', req);
      return  req;
    } catch (error) {
      return error;
    }
  }

  @Get('/')
  GetAll() {
    try {
      return this.chamadoService.getAll();
    } catch (error) {
      return error;
    }
  }

  @Get('/:id')
  GetOne(@Param('id') id: number) {
    try {
      return this.chamadoService.getOne(id);
    } catch (error) {
      return error;
    }
  }

  @Get('/pesquisar')
  Search(@Query() pesquisa: any) {
    try {
      const all = pesquisa;
      return this.chamadoService.search(all);
    } catch (error) {
      return error;
    }
  }

  @Put('/atualizar/:id')
  Update(@Param('id') id: number, @Body() data: UpdateChamadoDto) {
    try {
      return this.chamadoService.update(id, data);
    } catch (error) {
      return error;
    }
  }

  @Delete('/delete/:id')
  Delete(@Param('id') id: number) {
    try {
      return this.chamadoService.delete(id);
    } catch (error) {
      return error;
    }
  }
}
