import { Controller, Get } from '@nestjs/common';
import { BugService } from './bug.service';

@Controller('bug')
export class BugController {
  constructor(private bugService: BugService) {}

  @Get('/')
  async getAll() {
    return await this.bugService.getAll();
  }

  
}
