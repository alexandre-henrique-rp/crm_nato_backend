import { Injectable, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChamadoDto } from './dto/create_chamado.dto';
import { AuthGuard } from '../auth.guard';
@UseGuards(AuthGuard)
@Injectable()
export class ChamadoService {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateChamadoDto, user: any) {
    return await this.prismaService.nato_chamados.create({
      data: {
        ...data,
        idUser: user.id,
      },
     });
  }

}
