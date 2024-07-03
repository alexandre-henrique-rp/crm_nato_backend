import { Module } from '@nestjs/common';
import { EmpreendimentoController } from './empreendimento.controller';
import { EmpreendimentoService } from './empreendimento.service';

@Module({
  controllers: [EmpreendimentoController],
  providers: [EmpreendimentoService]
})
export class EmpreendimentoModule {}
