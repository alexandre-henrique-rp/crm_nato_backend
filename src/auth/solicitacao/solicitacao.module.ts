import { Module } from '@nestjs/common';
import { SolicitacaoController } from './solicitacao.controller';
import { SolicitacaoService } from './solicitacao.service';
import { PublicController } from './public/public.controller';

@Module({
  controllers: [SolicitacaoController, PublicController],
  providers: [SolicitacaoService],
})
export class SolicitacaoModule {}
