import { Module } from '@nestjs/common';
import { GetInfosService } from './get-infos.service';
import { GetInfosController } from './get-infos.controller';

@Module({
  providers: [GetInfosService],
  controllers: [GetInfosController]
})
export class GetInfosModule {}
