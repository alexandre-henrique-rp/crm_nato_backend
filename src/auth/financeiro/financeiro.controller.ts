import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { FinanceiroService } from './financeiro.service';
import { CreateFinanceiroDto } from './dto/create-financeiro.dto'
import { UpdateFinanceiroDto } from './dto/update-financeiro.dto';

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
  async Create(@Body() CreateFinanceiroDto: CreateFinanceiroDto) {
    try {
      return await this.financeiroService.create(CreateFinanceiroDto);
    } catch (error) {
      throw error;
    }
  }

  @Put('/update/:id')
  async Update(@Param('id') id: number, @Body() UpdateFinanceiroDto: UpdateFinanceiroDto) {
    try {
      return await this.financeiroService.update(id, UpdateFinanceiroDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete('/delete/:id')
  async Delete(@Param('id', new ParseIntPipe()) id: number) {
    try {
      return await this.financeiroService.delete(id);
    } catch (error) {
      throw error;
    }
  }
 
}
