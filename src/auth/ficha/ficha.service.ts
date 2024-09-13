import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FichaService {
  constructor(private prismaService: PrismaService) { }

  async CreateFicha(data: any) {
    try {
      console.log(data)
      return this.prismaService.fcweb.create({ data: { ...data, pgto_efi: '', im: 0 } })
    } catch (error) {
      return error.message
    }
  }

  async GetUpdate(id: number) {
    try {
      //buscar informações da solicitação
      const solicitação = await this.prismaService.nato_solicitacoes_certificado.findFirst({
        where: {
          id: id
        }
      })

      return solicitação
    } catch (error) {
      return error.message
    }
  }
}
