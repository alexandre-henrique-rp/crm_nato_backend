import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth.guard';
import { AlertsService } from './alerts.service';

@UseGuards(AuthGuard)
@Controller('alerts')
export class AlertsController {
  constructor(private empresaService: AlertsService) {}
  //criar alerta
  @Post()
  async Create(@Body() data: any) {
    try {
      const req = await this.empresaService.Create(data);
      return req;
    } catch (error) {
      return error;
    }
  }

  //Lista de alertas gerais
  @Get()
  async GetAll(@Req() request: any) {
    try {
      const req = await this.empresaService.GetAll(request.user.hierarquia);
      return req;
    } catch (error) {
      return error;
    }
  }

  //listar alertas
  @Get('/:id')
  async GetAllUser(@Param('id') id: number) {
    try {
      const req = await this.empresaService.GetAllUser(Number(id));
      return req;
    } catch (error) {
      return error;
    }
  }

  //atualizar alerta
  @Put('/update/:id')
  async Update(@Param('id') id: number, @Body() data: any) {
    try {
      const req = await this.empresaService.Update(id, data);
      return req;
    } catch (error) {
      if (error.meta.field_name === 'corretor') {
        return {
          message: 'Corretor não encontrado',
        };
      }
      return error;
    }
  }

  //remover alerta
  @Delete('/delete/:id')
  async Delete(@Param('id') id: number) {
    try {
      await this.empresaService.Delete(Number(id));
      return {
        message: 'Alerta removido com sucesso',
      };
    } catch (error) {
      return error;
    }
  }
}
