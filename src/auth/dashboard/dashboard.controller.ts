import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth.guard';
import { DashboardService } from './dashboard.service';

@UseGuards(AuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('/')
  async GetDashboard() {
    return await this.dashboardService.getDashboard();
  }
}
