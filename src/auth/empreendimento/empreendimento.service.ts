import { Injectable } from '@nestjs/common';
import { error } from 'console';
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
          uf: true,
          cidade: true,
          ativo: true,
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
    }finally{
      this.prismaService.$disconnect
    }
  }

  async GetOne(id: number) {
    try {
      const req = await this.prismaService.nato_empreendimento.findUnique({
        where: {
          id: id
        },
      });
      console.log(req)
      return req
    } catch (error) {
      console.error(error.message);
      return error.message;
    }finally{
      this.prismaService.$disconnect
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
    }finally{
      this.prismaService.$disconnect
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
    }finally{
      this.prismaService.$disconnect
    }
  }

  async Create(data: any) {
    try {
      const req = await this.prismaService.nato_empreendimento.create({
        data: data
        // {
        //   // nome: data.nome,
        //   // construtora: data.construtora,
        //   // financeiro: data.financeiro,
        //   // dt_inicio: new Date(data.dt_inicio).toISOString(),
        //   // // dt_fim: new Date(data.dt_fim).toISOString().split('T')[0],
        //   // uf: data.uf,
        //   // cidade: data.cidade,
        //   // vendedores: data.vendedores,
        //   // ativo: true,
        //   // tag: 'NATO_'
        // },
      });
      return req;
    } catch (error) {
      console.error(error.message);
      return error.message;
    }finally{
      this.prismaService.$disconnect
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
    }finally{
      this.prismaService.$disconnect
    }
  }

  async Delete(id: number) {
    try {
      const IsAtivo = await this.prismaService.nato_empreendimento.findUnique({
        where: {
          id: id
        },
        select: {
          ativo: true
        }
      })
      return await this.prismaService.nato_empreendimento.update({
        where: {
          id: id
        },
        data: {
          ativo: (IsAtivo.ativo ? false : true)
        }
      })
    } catch (error) {
      return error;
    }finally{
      this.prismaService.$disconnect
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
    }finally{
      this.prismaService.$disconnect
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
    }finally{
      this.prismaService.$disconnect
    }
  }
}
