import { Module } from '@nestjs/common';
import { BugController } from './bug.controller';
import { BugService } from './bug.service';

@Module({
  controllers: [BugController],
  providers: [BugService]
})
export class BugModule {}
