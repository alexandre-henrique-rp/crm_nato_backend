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
      console.log(req.user);
      return this.solicitacaoService.findAll(req.user.id, req.user.hierarquia);
    } catch (error) {
      throw error;
    }
  }

  @Get('/:id')
  async GetOne(@Param('id') id: number, @Req() req: any) {
    try {
      return this.solicitacaoService.findOne(
        id,
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
  async Delete(@Param('id') id: string, @Req() req: any) {
    try {
      return this.solicitacaoService.delete(id, req.user.id);
    } catch (error) {
      throw error;
    }
  }

  @Put('/update/:id')
  async Update(@Param('id') id: string, @Body() data: any, @Req() req: any) {
    try {
      return this.solicitacaoService.update(id, {
        ...data,
        userId: req.user.id,
        user: req.user,
      });
    } catch (error) {
      throw error;
    }
  }
}
