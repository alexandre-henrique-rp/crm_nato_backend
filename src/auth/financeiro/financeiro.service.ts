import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FinanceiroService {
  constructor(private prismaService: PrismaService) { }

  async findAll() {
    try {
      const req = await this.prismaService.nato_financeiro.findMany({
        orderBy: {
          fantasia: 'asc',
        },
      });
      return req
    } catch (error) {
      console.error(error.message);
      return error.message;
    }finally{
      this.prismaService.$disconnect
    }
  }

  async findOne(id: number) {
    try {
      return await this.prismaService.nato_financeiro.findFirst({
        where: {
          id: Number(id),
        },
      });
    } catch (error) {
      console.error(error.message);
      return error.message;
    }finally{
      this.prismaService.$disconnect
    }
  }

  async create(data: any) {
    try {
      return await this.prismaService.nato_financeiro.create({
        data: {
          ...data,
          colaboradores: data.colaboradores,
        },
      });
    } catch (error) {
      console.error(error.message);
      return error.message;
    }finally{
      this.prismaService.$disconnect
    }
  }

  async update(id: number, data: any) {
    try {
      return await this.prismaService.nato_financeiro.update({
        where: {
          id: Number(id),
        },
        data: {
          ...data,
          colaboradores: JSON.stringify(data.colaboradores),
        },
      });
    } catch (error) {
      console.error(error.message);
      return error.message;
    }finally{
      this.prismaService.$disconnect
    }
  }

  async delete(id: number) {
    try {
      await this.prismaService.nato_financeiro.delete({
        where: {
          id: id,
        },
      });
      return "Financeiro deletado com sucesso!"
    } catch (error) {
      return error
    }finally{
      this.prismaService.$disconnect
    }
  }
}
