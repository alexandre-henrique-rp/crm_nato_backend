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
import { SolicitacaoService } from './solicitacao.service';
import { AuthGuard } from '../auth.guard';

@UseGuards(AuthGuard)
@Controller('solicitacao')
export class SolicitacaoController {
  constructor(private solicitacaoService: SolicitacaoService) {}

  @Get('/')
  async GetAll(@Req() req: any) {
    try {
      return this.solicitacaoService.findAll(req.user.id, req.user.hierarquia);
    } catch (error) {
      throw error;
    }
  }

  @Get('/:id')
  async GetOne(@Param('id') id: number, @Req() req: any) {
    try {
      return this.solicitacaoService.findOne(
        Number(id),
        req.user.id,
        req.user.hierarquia,
      );
    } catch (error) {
      throw error;
    }
  }

  @Post('/')
  async Create(@Body() data: any, @Req() req: any) {
    try {
      return this.solicitacaoService.create({
        ...data,
        corretor: data.corretor ? data.corretor : req.user.id,
      });
    } catch (error) {
      throw error;
    }
  }

  @Delete('/delete/:id')
  async Delete(@Param('id') id: number) {
    try {
      await this.solicitacaoService.delete(Number(id));
      return {
        message: 'Solicitação deletada com sucesso!',
      };
    } catch (error) {
      throw error;
    }
  }

  @Put('/update/:id')
  async Update(@Param('id') id: number, @Body() data: any) {
    try {
      return this.solicitacaoService.update(Number(id), {
        ...data,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('/filter/doc')
  async FilterDoc(@Body() data: any) {
    try {
      return this.solicitacaoService.FilterDoc(data);
    } catch (error) {
      throw error;
    }
  }
  @Get('/filter/date')
  async FilterDate(@Body() data: any) {
    try {
      return this.solicitacaoService.FilterDate(data);
    } catch (error) {
      throw error;
    }
  }
}
