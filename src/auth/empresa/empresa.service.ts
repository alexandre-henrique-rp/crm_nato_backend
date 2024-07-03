import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmpresaService {
  constructor(private prismaService: PrismaService) {}
  async GetAll() {
    try {
      return await this.prismaService.nato_empresas.findMany();
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
        data: {
          cnpj: data.cnpj,
          razaosocial: data.razaosocial,
          tel: data.tel,
          email: data.email,
          colaboradores: JSON.stringify(data.colaboradores),
          responsavel: data.responsavel,
          tipo: data,
        },
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
          cnpj: data.cnpj,
          razaosocial: data.razaosocial,
          tel: data.tel,
          email: data.email,
          colaboradores: JSON.stringify(data.colaboradores),
          responsavel: data.responsavel,
          tipo: data,
        },
      });
    } catch (error) {
      return error;
    }
  }

  // async Delete(id: number) {
  //   try {
  //     return await this.prismaService.nato_empresas.update({
  //       where: {
  //         id: id,
  //       },
  //       data: {
  //         ativo: false,
  //       },
  //     });
  //   } catch (error) {
  //     return error;
  //   }
  // }
}
