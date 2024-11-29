import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChamadoDto } from './dto/create_chamado.dto';

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
