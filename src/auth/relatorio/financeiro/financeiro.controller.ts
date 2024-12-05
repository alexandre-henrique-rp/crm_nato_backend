import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReFinanceiroService } from './financeiro.service';

@Controller('relatorio/financeiro')
export class ReFinanceiroController {
  constructor(private readonly financeiroService: ReFinanceiroService) {}

  @Post()
  async GetPersonalizado(@Body() data: any) {
    try {
      console.log(data);
      return await this.financeiroService.findPersonalizado(data);
    } catch (error) {
      return error;
    }
  }
}
