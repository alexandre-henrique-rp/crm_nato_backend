import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NowService {
  constructor(private prismaService: PrismaService) {}

  async GetUpdate(id: number) {
    try {
      return await this.prismaService.nato_solicitacoes_certificado.findUnique({
        where: {
          id: id,
        },
        select: {
          alertanow: true,
        },
      });
    } catch (error) {
      console.error(error);
      return error;
    } finally {
      this.prismaService.$disconnect;
    }
  }

  async GetCreate(data: any) {
    try {
      return await this.prismaService.nato_solicitacoes_certificado.update({
        where: {
          id: data.id,
        },
        data: {
          alertanow: data.alertanow,
          dt_criacao_now: data.dt_criacao_now,
        },
      });
    } catch (error) {
      console.error(error);
      return error;
    } finally {
      this.prismaService.$disconnect;
    }
  }
}
