import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(private prismaService: PrismaService) {}

  async Create(data: any) {
    try {
      console.log(data);
      const request = await this.prismaService.nato_alerta.create({
        data,
      });
      console.log('🚀 ~ AlertsService ~ Create ~ request:', request);
      return request;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async GetAll(hierarquia: string) {
    try {
      return this.prismaService.nato_alerta.findMany({
        where: {
          ...(hierarquia === 'USER'
            ? {
                solicitacao_id: {
                  equals: null,
                },
                status: true,
              }
            : {}),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async GetAllUser(id: number) {
    try {
      return this.prismaService.nato_alerta.findMany({
        where: {
          corretor: id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async GetAllSolicitacao(id: number) {
    try {
      return this.prismaService.nato_alerta.findMany({
        where: {
          solicitacao_id: id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async Update(id: number, data: any) {
    try {
      return this.prismaService.nato_alerta.update({
        where: {
          id: Number(id),
        },
        data,
      });
    } catch (error) {
      return error;
    }
  }

  async Delete(id: number) {
    try {
      return this.prismaService.nato_alerta.update({
        where: {
          id: Number(id),
        },
        data: {
          status: false,
        },
      });
    } catch (error) {
      return error;
    }
  }
}
