import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
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
  async GetAll(@Req() req: any) {
    try {
      const Financeira = req.user.Financeira
      const Hierarquia = req.user.hierarquia

      return await this.empreendimentoService.GetAll(Financeira, Hierarquia);
    } catch (error) {
      return error;
    }
  }

  @Get('/:id')
  async GetOne(@Param('id') id: number) {
    const req = await this.empreendimentoService.GetOne(id);
    return new EmpreendimentoPresenter(req);
  }

  @Post('/')
  async Create(@Body() data: any) {
    const req = await this.empreendimentoService.Create(data);
    return req;
  }

  // @Post('/')
  // async FilterDate(@Body() data: any) {
  //   const req = await this.empreendimentoService.GetFilteDate(data);
  //   return req.map((data: any) => new EmpreendimentoPresenter(data));
  // }

  // @Post('/')
  // async FilterUser(@Body() data: any) {
  //   const req = await this.empreendimentoService.GetFilteUser(data);
  //   return req.map((data: any) => new EmpreendimentoPresenter(data));
  // }

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
    const req = await this.empreendimentoService.Filter(id);
    return req.map((data: any) => new EmpreendimentoPresenter(data));
  }
}
