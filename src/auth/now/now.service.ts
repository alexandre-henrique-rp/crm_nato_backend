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

  async GetCreate(id: number, data: any) {
    const dataAtual = new Date()

    try {

      const req = await this.prismaService.nato_solicitacoes_certificado.findUnique({
        where: {
          id: id,
        },
        select: {
          uploadCnh: true,
          uploadRg: true,
        },
      })
      
      if ((req.uploadCnh === '' && req.uploadRg === '')){
        throw new Error('Os documentos RG ou CNH são obrigatórios')
      }

      return await this.prismaService.nato_solicitacoes_certificado.update({
        where: {
          id: id,
        },
        data: {
          alertanow: data.alertanow,
          dt_criacao_now: dataAtual,
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
