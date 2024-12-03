import { Injectable, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChamadoDto } from './dto/create_chamado.dto';
import { AuthGuard } from '../auth.guard';
import { UpdateChamadoDto } from './dto/update_chamado.dto';
@UseGuards(AuthGuard)
@Injectable()
export class ChamadoService {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateChamadoDto) {
    return await this.prismaService.nato_chamados.create({
      data: {
        ...data,
      },
    });
  }

  async getAll() {
    return await this.prismaService.nato_chamados.findMany({
      where: {
        status: { not: 2 },
      },
      orderBy: {
        status: 'asc',
      }
    });
  }

  async getOne(id: number) {
    return await this.prismaService.nato_chamados.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, data: UpdateChamadoDto) {
    return await this.prismaService.nato_chamados.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: number) {
    return await this.prismaService.nato_chamados.update({
      where: {
        id,
      },
      data:{
        status: 3
      },
    });
  }

  async search(pesquisa: any) {
    return await this.prismaService.nato_chamados.findMany({
      where: {
       ...(pesquisa && pesquisa),
      }
    });
  }
}
