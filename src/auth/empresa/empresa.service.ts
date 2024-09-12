import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmpresaService {
  constructor(private prismaService: PrismaService) { }
  async GetAll(all: string) {
    try {
      return await this.prismaService.nato_empresas.findMany({
        where: {
          ...(all !== "*" && {
            atividade: {
              not: "CERT"
            }
          }
          ),
          ...(all !== '2%' && {
            atividade: {
              not: "CERT"
            }
          }
          ),
          ...(!all && {
            atividade: {
              not: "CERT"
            }
          }
          ),
        },
        orderBy: {
          fantasia: 'asc',
        }
      });
    } catch (error) {
      return error;
    }
  }

  async GetOne(id: number) {
    try {
      return await this.prismaService.nato_empresas.findFirst({
        where: {
          id: id,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async Create(data: any) {
    try {
      return await this.prismaService.nato_empresas.create({
        data: data,
      });
    } catch (error) {
      return error;
    }
  }

  async Update(id: number, data: any) {
    try {
      return await this.prismaService.nato_empresas.update({
        where: {
          id: id,
        },
        data: {
          ...data,
          colaboradores: JSON.stringify(data.colaboradores),
        },
      });
    } catch (error) {
      return error;
    }
  }

  async Delete(id: number) {
    try {
      return await this.prismaService.nato_empresas.delete({
        where: {
          id: Number(id),
        },
      });
    } catch (error) {
      return error;
    }
  }
}
