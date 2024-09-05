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

}
