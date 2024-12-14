import { Module } from '@nestjs/common';
import { NowController } from './now.controller';
import { NowService } from './now.service';

@Module({
  controllers: [NowController],
  providers: [NowService]
})
export class NowModule {}
