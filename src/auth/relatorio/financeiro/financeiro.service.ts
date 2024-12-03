import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

let total = 0;
@Injectable()
export class ReFinanceiroService {
  constructor(private readonly prismaService: PrismaService) {}
  async findPersonalizado(dados: any) {
    try {
      const { construtora, empreendimento, inicio, fim, situacao } = dados;
      const valorConst = await this.getConstrutoraValor(construtora);
      const List =
        await this.prismaService.nato_solicitacoes_certificado.findMany({
          where: {
            ...(empreendimento && { empreedimento: empreendimento }),
            ...(construtora && { construtora: construtora }),
            ...(inicio &&
              fim && {
                createdAt: {
                  gte: new Date(inicio),
                  lte: new Date(fim),
                },
              }),
            Andamento: {
              in: ['APROVADO', 'EMITIDO', 'REVOGADO'],
            },
            dt_aprovacao: {
              not: null,
            },
            ...(situacao && {
              situacao_pg: {
                equals: situacao,
              },
            }),
          },
          select: {
            id: true,
            nome: true,
            cpf: true,
            id_fcw: true,
            estatos_pgto: true,
            valorcd: true,
            dt_aprovacao: true,
            createdAt: true,
            empreedimento: true,
            financeiro: true,
            corretor: true,
            type_validacao: true,
          },
        });

      return {
        error: false,
        message: 'Success',
        data: {
          ...(List.length > 0 && {
            solicitacao: await Promise.all(
              List.map(async (item: any) => ({
                ...item,
                empreedimento: await this.getEmpreedimento(item.empreedimento),
                financeiro: await this.getFinaceiro(item.financeiro),
                corretor: await this.getCorretor(item.corretor),
                createdAt: new Date(item.createdAt).toISOString(),
                dt_aprovacao: item.dt_aprovacao
                  ? new Date(item.dt_aprovacao).toISOString()
                  : null,
                certificado: await this.getCertificado(
                  item.cpf,
                  inicio,
                  fim,
                ),
              })),
            ),
          }),
          totalFcw: total,
          ValorTotal: total > 0 ? total * valorConst : 0,
        },

        //consertar retorno
      };
    } catch (error) {
      return error;
    } finally {
      this.prismaService.$disconnect();
    }
  }

  // api
  async getEmpreedimento(id: number) {
    try {
      const empreedimento = this.prismaService.nato_empreendimento.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          nome: true,
          cidade: true,
        },
      });
      return empreedimento;
      
    } catch (error) {
      console.log('🚀 ~ getEmpreedimento ~ error:', error);
      return {
        id: 0,
        nome: 'Não informado',
      };
    } finally{
      this.prismaService.$disconnect();
    }
   
  }

  async getFinaceiro(id: number) {
    try {
      const financeiro = this.prismaService.nato_financeiro.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          fantasia: true,
        },
      });
      return financeiro;
    } catch (error) {
      console.log('🚀 ~ getFinaceiro ~ error:', error);
      return {
        id: 0,
        fantasia: 'Não informado',
      };
    } finally {
      this.prismaService.$disconnect();
    }
  };

  getCorretor = async (id: number) => {
    try {
      const corretor = this.prismaService.nato_user.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          nome: true,
        },
      });
      return corretor;
    } catch (error) {
      console.log('🚀 ~ getCorretor ~ error:', error);
      return {
        id: 0,
        nome: id,
      };
    } finally {
      this.prismaService.$disconnect();
    }
  };

  getCertificado = async (cpf: string, inicio: string, fim: string) => {
    const gepFim = new Date(fim);
    gepFim.setMonth(gepFim.getMonth() + 3);
    const certificado = await this.prismaService.fcweb.count({
      where: {
        cpf: cpf,
        andamento: {
          in: ['APROVADO', 'EMITIDO', 'REVOGADO'],
        },
        dt_aprovacao: {
          not: null,
        },
        estatos_pgto: {
          not: 'Pago',
        },
        createdAt: {
          gte: new Date(inicio),
          lte: gepFim,
        },
        tipocd: {
          equals: 'A3PF Bird5000',
        },
      },
    });
    this.prismaService.$disconnect();
    total += certificado;
    return certificado;
  };

  getConstrutoraValor = async (id: number) => {
    const construtora = await this.prismaService.nato_empresas.findUnique({
      where: {
        id,
      },
      select: {
        valor_cert: true,
      },
    });
    this.prismaService.$disconnect();
    return !construtora?.valor_cert ? 100 : construtora?.valor_cert;
  };
}
