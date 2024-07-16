import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmpreendimentoService {
  constructor(private prismaService: PrismaService) {}

  async GetAll() {
    try {
      return await this.prismaService.nato_empreendimento.findMany({
        where: {
          ativo: false,
        },
        select: {
          id: true,
          nome: true,
          construtora: true,
          dt_inicio: true,
          dt_fim: true,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async GetOne(id: number) {
    try {
      return await this.prismaService.nato_empreendimento.findFirst({
        where: {
          id: Number(id),
          ativo: true,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async GetFilteUser(user: string) {
    try {
      return await this.prismaService.nato_empreendimento.findMany({
        where: {
          vendedores: {
            contains: user,
          },
          ativo: true,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async GetFilteSolicitacao() {}
  async GetFilteDate(data: any) {
    try {
      return this.prismaService.nato_empreendimento.findMany({
        where: {
          ...(data.inicio && data.fim
            ? {
                dt_inicio: {
                  gte: new Date(data.inicio).toISOString(),
                },
                dt_fim: {
                  lte: new Date(data.fim).toISOString(),
                },
              }
            : data.inicio && data.rengInit
              ? {
                  dt_inicio: {
                    gte: new Date(data.inicio).toISOString(),
                    lte: new Date(data.rengInit).toISOString(),
                  },
                }
              : data.fim && data.rengEnd
                ? {
                    dt_fim: {
                      gte: new Date(data.rengEnd).toISOString(),
                      lte: new Date(data.fim).toISOString(),
                    },
                  }
                : data.inicio
                  ? {
                      dt_inicio: {
                        equals: new Date(data.inicio).toISOString(),
                      },
                    }
                  : {
                      dt_fim: {
                        equals: new Date(data.fim).toISOString(),
                      },
                    }),
          ativo: true,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async Create(data: any) {
    try {
      return this.prismaService.nato_empreendimento.create({
        data: {
          nome: data.nome,
          construtora: data.construtora,
          dt_inicio: new Date(data.dt_inicio).toISOString(),
          dt_fim: new Date(data.dt_fim).toISOString(),
          uf: data.uf,
          cidade: data.cidade,
          chave: data.chave,
          vendedores: data.vendedores,
          ativo: true,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async Update(id: number, data: any) {
    try {
      return this.prismaService.nato_empreendimento.update({
        where: {
          id: Number(id),
        },
        data: data,
      });
    } catch (error) {
      return error;
    }
  }

  async Delete(id: number) {
    try {
      return this.prismaService.nato_empreendimento.update({
        where: {
          id: Number(id),
        },
        data: {
          ativo: false,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async Filter(id: number) {
    try {
      return this.prismaService.nato_empreendimento.findMany({
        where: {
          construtora: Number(id),
          ativo: true,
        },
      });
    } catch (error) {
      return error;
    }
  }
}
