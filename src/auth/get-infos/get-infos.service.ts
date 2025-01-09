import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GetInfosService {
  constructor(private prismaService: PrismaService) {}

  async CheckCpf(cpf: string) {
    try{
      return await this.prismaService.nato_solicitacoes_certificado.findFirst({
        where:{
          cpf: cpf
        }
      })
    }catch (error) {
      return error
    }finally{
      this.prismaService.$disconnect
    }
  }
}
