import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DiretoService } from './direto.service';
import { CreateDiretoDto } from './dto/create-direto.dto';
import { UpdateDiretoDto } from './dto/update-direto.dto';
import { AuthGuard } from '../auth.guard';

@UseGuards(AuthGuard)
@Controller('direto')
export class DiretoController {
  constructor(private readonly diretoService: DiretoService) {}

  @Get()
  async findAll() {
    return await this.diretoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.diretoService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDiretoDto: UpdateDiretoDto) {
    return await this.diretoService.update(+id, updateDiretoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diretoService.remove(+id);
  }
}
