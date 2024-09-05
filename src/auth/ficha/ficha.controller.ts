import { Body, Controller, Post } from '@nestjs/common';
import { FichaService } from './ficha.service';

@Controller('ficha')
export class FichaController {
  constructor(private fichaService: FichaService ) { }

  @Post('/')
  async create(@Body() data: any) {
    return this.fichaService.CreateFicha(data)
  } 
}

