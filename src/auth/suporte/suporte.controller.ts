import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { SuporteService } from './suporte.service';
import { CreateSuporteDto } from './dto/create-suporte.dto';
import { UpdateSuporteDto } from './dto/update-suporte.dto';

@Controller('suporte')
export class SuporteController {
  constructor(private readonly suporteService: SuporteService) {}

  @Post()
  create(@Body() createSuporteDto: CreateSuporteDto) {
    return this.suporteService.create(createSuporteDto);
  }

  @Get(':id')
  findAllById(@Param('id', new ParseIntPipe()) id: number) {
    return this.suporteService.findAllById(id);
  }

  @Get('/getone/:id')
  findOne(@Param('id') id: string) {
    return this.suporteService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id', new ParseIntPipe()) id: number, @Body() updateSuporteDto: UpdateSuporteDto) {
    return this.suporteService.update(id, updateSuporteDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.suporteService.remove(id);
  }

  @Put('/deleteimg/:id')
  deleteImg(@Param('id', new ParseIntPipe()) id: number, @Body() index: number) {
    return this.suporteService.deleteImg(id, +index);
  }
}
