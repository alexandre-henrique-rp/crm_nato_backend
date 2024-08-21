import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { FinanceiroService } from './financeiro.service';

@Controller('financeiro')
export class FinanceiroController {
  constructor(private financeiroService: FinanceiroService) {}

  @Get('/')
  async GetAll() {
    try {
      return await this.financeiroService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get('/:id')
  async GetOne(@Param('id') id: number) {
    try {
      return await this.financeiroService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Post('/')
  async Create(@Body() data: any) {
    try {
      return await this.financeiroService.create(data);
    } catch (error) {
      throw error;
    }
  }

  @Put('/update/:id')
  async Update(@Param('id') id: number, @Body() data: any) {
    try {
      return await this.financeiroService.update(id, data);
    } catch (error) {
      throw error;
    }
  }

  @Delete('/delete/:id')
  async Delete(@Param('id') id: number) {
    try {
      return await this.financeiroService.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
