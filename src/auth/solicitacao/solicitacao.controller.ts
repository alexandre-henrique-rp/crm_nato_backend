import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SolicitacaoService } from './solicitacao.service';
import { AuthGuard } from '../auth.guard';
import { SolicitacaoPresenter } from './solicitacao.presenter';

@UseGuards(AuthGuard)
@Controller('solicitacao')
export class SolicitacaoController {
  constructor(private solicitacaoService: SolicitacaoService) { }

  @Get('/')
  async GetAll(@Req() req: any) {
    try {
      const Financeira = req.user.Financeira
      const Hierarquia = req.user.hierarquia
      const Id = req.user.id
      const requisicao = await this.solicitacaoService.findAll(Id, Hierarquia, Financeira)
      // console.log("🚀 ~ SolicitacaoController ~ GetAll ~ requisicao:", requisicao)
      return requisicao
    } catch (error) {
      throw error;
    }
  }

  @Get('/:id')
  async GetOne(@Param('id') id: number, @Req() req: any) {
    try {
      const Financeira = req.user.Financeira
      const Hierarquia = req.user.hierarquia
      const UserId = req.user.id
      return this.solicitacaoService.findOne(
        Number(id),
        UserId,
        Hierarquia,
        Financeira
      );
    } catch (error) {
      throw error;
    }
  }

  @Post('/')
  async Create(@Body() data: any, @Req() req: any, @Query() query: any) {
    try {
      const { sms } = query
      return this.solicitacaoService.create({
        ...data,
        corretor: data.corretor ? data.corretor : req.user.id,
      }, sms);
    } catch (error) {
      throw error;
    }
  }

  @Delete('/delete/:id')
  async Delete(@Param('id') id: number, @Req() req: any) {
    try {
      await this.solicitacaoService.delete(Number(id), req.user);
      return {
        message: 'Solicitação deletada com sucesso!',
      };
    } catch (error) {
      throw error;
    }
  }

  @Put('/update/:id')
  async Update(@Param('id') id: number, @Body() data: any, @Req() req: any) {
    try {
      return this.solicitacaoService.update(Number(id), {
        ...data,
      }, req.user);
    } catch (error) {
      throw error;
    }
  }

  @Get('/filter/doc/:doc')
  async FilterDoc(@Param('doc') doc: string) {
    try {
      const req = await this.solicitacaoService.FilterDoc(doc);
      return req.map((data: any) => new SolicitacaoPresenter(data));
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
