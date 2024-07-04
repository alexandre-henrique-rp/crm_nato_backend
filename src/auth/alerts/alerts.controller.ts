import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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

  //listar alertas
  @Get('/user/:id')
  async GetAllUser(@Param('id') id: number) {
    try {
      const req = await this.empresaService.GetAllUser(id);
      return req;
    } catch (error) {
      return error;
    }
  }

  @Get('/solicitacao/:id')
  async GetAllSolicitacao(@Param('id') id: number) {
    try {
      const req = await this.empresaService.GetAllSolicitacao(id);
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
      return error;
    }
  }

  //remover alerta
  @Delete('/delete/:id')
  async Delete(@Param('id') id: number) {
    try {
      await this.empresaService.Delete(id);
      return {
        message: 'Alerta removido com sucesso',
      };
    } catch (error) {
      return error;
    }
  }
}
