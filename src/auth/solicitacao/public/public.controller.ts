import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { SolicitacaoService } from '../solicitacao.service';
import { CheckCpfDto } from '../dto/check_cpf.dto';

@Controller('public')
export class PublicController {
  constructor(private solicitacaoService: SolicitacaoService) { }

  @Post('/find')
  async app(@Body() body: CheckCpfDto) {
    return this.solicitacaoService.app(body);
  }

  @Get('/adm/delete/solicitacao/:id/:password')
  async delete(@Param('id', new ParseIntPipe()) id: number, @Param('password') password: string) {
    return this.solicitacaoService.deletesolicitacao(id, password);
  }

}
