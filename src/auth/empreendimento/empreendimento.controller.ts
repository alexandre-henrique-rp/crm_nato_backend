import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth.guard';
import { EmpreendimentoService } from './empreendimento.service';
import { EmpreendimentoPresenter } from './empreendimento.presenter';

@UseGuards(AuthGuard)
@Controller('empreendimento')
export class EmpreendimentoController {
  constructor(private empreendimentoService: EmpreendimentoService) {}

  @Get('/')
  async GetAll() {
    const req = await this.empreendimentoService.GetAll();
    return req.map((data: any) => new EmpreendimentoPresenter(data));
  }

  @Get('/:id')
  async GetOne(@Param('id') id: number) {
    const req = await this.empreendimentoService.GetOne(id);
    return new EmpreendimentoPresenter(req);
  }

  @Post('/')
  async Create(@Body() data: any) {
    console.log(data);
    const req = await this.empreendimentoService.Create(data);
    return new EmpreendimentoPresenter(req);
  }

  @Post('/')
  async FilterDate(@Body() data: any) {
    const req = await this.empreendimentoService.GetFilteDate(data);
    return req.map((data: any) => new EmpreendimentoPresenter(data));
  }

  @Post('/')
  async FilterUser(@Body() data: any) {
    const req = await this.empreendimentoService.GetFilteUser(data);
    return req.map((data: any) => new EmpreendimentoPresenter(data));
  }

  @Put('/:id')
  async Update(@Param('id') id: number, @Body() data: any) {
    const req = await this.empreendimentoService.Update(id, data);
    return new EmpreendimentoPresenter(req);
  }

  @Delete('/delete/:id')
  async Delete(@Param('id') id: number) {
    return this.empreendimentoService.Delete(id);
  }

  @Get('/filter/:id')
  async Filter(@Param('id') id: number) {
    console.log(id);
    const req = await this.empreendimentoService.Filter(id);
    return req.map((data: any) => new EmpreendimentoPresenter(data));
  }
}
