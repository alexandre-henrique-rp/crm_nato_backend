import { Controller, Get, Param } from '@nestjs/common';
import { GetInfosService } from './get-infos.service';

@Controller('get-infos')
export class GetInfosController {
  constructor(private GetInfosService: GetInfosService) {}

  @Get('/checkcpf/:cpf')
  async CheckCpf(@Param('cpf') cpf: string) {
    return await this.GetInfosService.CheckCpf(cpf);
   
  }
}
