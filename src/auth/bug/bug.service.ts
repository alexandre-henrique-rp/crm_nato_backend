import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BugService {
  constructor(private prismaService: PrismaService) {}

  async getAll() {
    try {
      const req = await this.prismaService.nato_bug_alert.findMany({
        where: {
          status: true
        }
      })

      return req
    } catch (error) {
      return error.message
    }finally{
      this.prismaService.$disconnect
    }
  }
}
