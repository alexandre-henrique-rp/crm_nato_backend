import { Module } from '@nestjs/common';
import { ConstrutorasService } from './construtoras.service';
import { ConstrutorasController } from './construtoras.controller';

@Module({
  controllers: [ConstrutorasController],
  providers: [ConstrutorasService],
})
export class ConstrutorasModule {}
