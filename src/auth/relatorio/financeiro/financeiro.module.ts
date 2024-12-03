import { Module } from '@nestjs/common';
import { ReFinanceiroController } from './financeiro.controller';
import { ReFinanceiroService } from './financeiro.service';

@Module({
  controllers: [ReFinanceiroController],
  providers: [ReFinanceiroService]
})
export class ReFinanceiroModule {}
