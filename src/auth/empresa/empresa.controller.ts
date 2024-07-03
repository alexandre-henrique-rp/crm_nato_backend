import { Controller, UseGuards } from '@nestjs/common';
import { Get, Post, Put, Param, Body } from '@nestjs/common';
import { EmpresaPresenter } from './empresa.presenter';
import { AuthGuard } from '../auth.guard';
import { EmpresaService } from './empresa.service';

@UseGuards(AuthGuard)
@Controller('empresa')
export class EmpresaController {
  constructor(private empresaService: EmpresaService) {}

  @Get('/')
  async GetAll() {
    const req = await this.empresaService.GetAll();
    return req.map((data: any) => new EmpresaPresenter(data));
  }

  @Get('/:id')
  async GetOne(@Param('id') id: number) {
    const req = await this.empresaService.GetOne(id);
    return new EmpresaPresenter(req);
  }

  @Post('/')
  async Create(@Body() data: any) {
    const req = await this.empresaService.Create(data);
    return new EmpresaPresenter(req);
  }

  @Put('/update/:id')
  async Update(@Param('id') id: number, @Body() data: any) {
    const req = await this.empresaService.Update(id, data);
    return new EmpresaPresenter(req);
  }

  // @Delete('/delete/:id')
  // async Delete(@Param('id') id: number) {}
}
