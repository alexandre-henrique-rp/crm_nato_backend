import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(private prismaService: PrismaService) {}

  async Create(data: any) {
    try {
      return this.prismaService.nato_alerta.create({
        data,
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
          id,
        },
        data,
      });
    } catch (error) {
      throw error;
    }
  }

  async Delete(id: number) {
    try {
      return this.prismaService.nato_alerta.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
