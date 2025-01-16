import { Body, Controller, Post } from '@nestjs/common';
import { SolicitacaoService } from '../solicitacao.service';
import { CheckCpfDto } from '../dto/check_cpf.dto';

@Controller('public')
export class PublicController {
  constructor(private solicitacaoService: SolicitacaoService) { }

  @Post('/find')
  async app(@Body() body: CheckCpfDto) {
    return this.solicitacaoService.app(body);
  }

}
