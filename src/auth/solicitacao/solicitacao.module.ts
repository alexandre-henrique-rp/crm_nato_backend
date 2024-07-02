import { Module } from '@nestjs/common';
import { SolicitacaoController } from './solicitacao.controller';
import { SolicitacaoService } from './solicitacao.service';

@Module({
  controllers: [SolicitacaoController],
  providers: [SolicitacaoService],
})
export class SolicitacaoModule {}
