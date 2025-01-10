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

  @Get('/empreendimentos')
  async GetEmpreendimentos() {
    return await this.dashboardService.GetEmpreendimento();
  }

  @Get('/construtoras')
  async GetConstrutoras() {
    return await this.dashboardService.GetConstrutoras();
  }

  @Get('/financeiras')
  async GetFinanceiras() {
    return await this.dashboardService.GetFinanceira();
  }
}
