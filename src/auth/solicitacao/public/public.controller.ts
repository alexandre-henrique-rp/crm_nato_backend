import { Body, Controller, Put } from '@nestjs/common';
import { SolicitacaoService } from '../solicitacao.service';

@Controller('public')
export class PublicController {
  constructor(private solicitacaoService: SolicitacaoService) { }

  @Put('/find')
  async app(@Body() body) {
    return this.solicitacaoService.app(body);
  }

}
