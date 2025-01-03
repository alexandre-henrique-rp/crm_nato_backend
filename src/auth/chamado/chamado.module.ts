import { Module } from '@nestjs/common';
import { ChamadoController } from './chamado.controller';
import { ChamadoService } from './chamado.service';

@Module({
  controllers: [ChamadoController],
  providers: [ChamadoService]
})
export class ChamadoModule {}
