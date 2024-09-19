import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmpreendimentoService {
  constructor(private prismaService: PrismaService) {}

  async GetAll(Financeira: any, Hierarquia: string, Construtora: any) {
    try {
      const Ids = Financeira.map((item: { id: any }) => String(item.id));
      const IdsConst = Construtora.map((i: any) => i.id) // Convertendo IDs para string se necessário
      const req = await this.prismaService.nato_empreendimento.findMany({
        where: {
          ativo: true,
          ...(Hierarquia === 'CONST' && {
            OR: Ids.map((id: any) => ({
              financeiro: { contains: id },
            }),
          ),
          }),
        },
        select: {
          id: true,
          nome: true,
          construtora: true,
          dt_inicio: true,
          dt_fim: true,
        },
        orderBy: {
          nome: 'asc',
        },
      });

      const data = req.filter((i: any) => i.construtora == IdsConst[0]);

      return Hierarquia === 'CONST' ? data : req;
    } catch (error) {
      console.error('Erro ao buscar empreendimentos:', error);
      throw new Error('Erro ao buscar empreendimentos. Por favor, tente novamente mais tarde.');
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
      console.error(error.message);
      return error.message;
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
      console.error(error.message);
      return error.message;
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
      console.error(error.message);
      return error.message;
    }
  }

  async Create(data: any) {
    try {
      const req = await this.prismaService.nato_empreendimento.create({
        data: {
          nome: data.nome,
          construtora: data.construtora,
          dt_inicio: new Date(data.dt_inicio).toISOString(),
          // dt_fim: new Date(data.dt_fim).toISOString().split('T')[0],
          uf: data.uf,
          cidade: data.cidade,
          vendedores: JSON.stringify(data.vendedores),
          ativo: true,
        },
      });
      return req;
    } catch (error) {
      console.error(error.message);
      return error.message;
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
      console.error(error.message);
      return error.message;
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
    console.log(id)
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


  async GetAllBusca(financeiro: string, construtora: string) {
    try {
      const request = await this.prismaService.nato_empreendimento.findMany({
        where:{
          financeiro: {
            contains: financeiro
          },
          construtora: Number(construtora)
        },
        select: {
          id: true,
          nome: true
        }
      })

      return request
    } catch (error) {
      return error
    }
  }
}
