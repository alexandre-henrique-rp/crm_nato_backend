import { Module } from '@nestjs/common';
import { ChecktelController } from './checktel.controller';
import { ChecktelService } from './checktel.service';

@Module({
  controllers: [ChecktelController],
  providers: [ChecktelService]
})
export class ChecktelModule {}
