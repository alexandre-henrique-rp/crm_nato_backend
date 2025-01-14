import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SolicitacaoService } from './solicitacao.service';
import { AuthGuard } from '../auth.guard';
import { SolicitacaoPresenter } from './solicitacao.presenter';
import { CreateSolicitacaoDto } from './dto/create_solicitacao.dto';

@UseGuards(AuthGuard)
@Controller('solicitacao')
export class SolicitacaoController {
  constructor(private solicitacaoService: SolicitacaoService) { }

  @Get('/')
  async GetAll(@Req() req: any, @Query() query: any) {
    try {
      const filter ={
        ...(query.nome && { nome: query.nome } ),
        ...(query.andamento && { andamento:  query.andamento }),
        ...(query.construtora && { construtora: Number(query.construtora)  }),
        ...(query.empreedimento && { empreedimento: Number(query.empreedimento) }),
        ...(query.financeiro && { financeiro: Number(query.financeiro) } ),
        ...(query.id && { id: Number(query.id) }),
      }

      const requisicao = await this.solicitacaoService.GetAllPaginationAndFilter(
        query.pagina,
        query.limite,
        filter,
        req.user
      )
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
  async Create(@Body() data: CreateSolicitacaoDto, @Req() req: any, @Query() query: any) {
    try {
      const { sms } = query
      return this.solicitacaoService.create({
        ...data,
        corretor: data.corretor ? data.corretor : req.user.id,
      }, sms, req.user);
    } catch (error) {
      console.log("🚀 ~ SolicitacaoController ~ Create ~ error:", error)
      throw error;
    }
  }

  @Get('/resend/:id')
  async Resend(@Param('id') id: number) {
    try {
      return this.solicitacaoService.ResendSms(Number(id));
    } catch (error) {
      throw error;
    }
  }

  @Put('/reativar/:id')
  async Reativar(@Param('id') id: number, @Req() req:any){
    console.log("🚀 ~ SolicitacaoController ~ Reativar ~ id:", id)
    try{
      await this.solicitacaoService.updateAtivo(Number(id), req.user)
      return{
        error: false,
        message: 'Solicitação Reativada com sucesso'
      }
    }catch (error){
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

  @Put('/atendimento/:id')
  async Atendimento(@Param('id', new ParseIntPipe())id : number, @Req() req: any) {
      return await this.solicitacaoService.Atendimento(id, req.user)
  }
  // @Get('/filter/date')
  // async FilterDate(@Body() data: any) {
  //   try {
  //     return this.solicitacaoService.FilterDate(data);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  @Post('/posttags')
  async PostTags(@Body() data: any, @Req() req: any) {
    return this.solicitacaoService.PostTags(data, req.user);
  }

  @Put('/pause/:id')
  async pause(@Body() body: any, @Param('id', new ParseIntPipe()) id: number, @Req() req: any) {
    return this.solicitacaoService.pause(body, id, req.user);
  }

}
