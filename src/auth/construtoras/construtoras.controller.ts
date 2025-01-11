import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { ConstrutorasService } from './construtoras.service';
import { CreateConstrutoraDto } from './dto/create-construtora.dto';
import { UpdateConstrutoraDto } from './dto/update-construtora.dto';

@Controller('construtoras')
export class ConstrutorasController {
  constructor(private readonly construtorasService: ConstrutorasService) {}

  @Post()
  create(@Body() createConstrutoraDto: CreateConstrutoraDto) {
    return this.construtorasService.create(createConstrutoraDto);
  }

  @Get()
  findAll() {
    return this.construtorasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.construtorasService.findOne(id);
  }

  @Put(':id')

  update(@Param('id', new ParseIntPipe()) id: number, @Body() updateConstrutoraDto: UpdateConstrutoraDto) {
    return this.construtorasService.update(id, updateConstrutoraDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.construtorasService.remove(id);
  }
}
