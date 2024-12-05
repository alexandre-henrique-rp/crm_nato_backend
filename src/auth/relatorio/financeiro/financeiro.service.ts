import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RetornoAllDto } from './dto/RetornoAll.dto';
import { resolve } from 'path';

let total = 0;
@Injectable()
export class ReFinanceiroService {
  constructor(private readonly prismaService: PrismaService) {}
  async findPersonalizado(dados: any): Promise<RetornoAllDto> {
    try {
      const { Construtora, empreendimento, Inicio, Fim, situacao } = dados;
      const valorConst = await this.getConstrutoraValor(Construtora);
      const List =
        await this.prismaService.nato_solicitacoes_certificado.findMany({
          where: {
            ...(empreendimento && { empreedimento: empreendimento }),
            ...(Construtora && { construtora: Construtora }),
            ...(Inicio &&
              Fim && {
                createdAt: {
                  gte: new Date(Inicio),
                  lte: new Date(Fim),
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
              List.map(async (item: any) => {
                await Promise.resolve((resolve: any) =>
                  setTimeout(resolve, 1000),
                );
                return {
                  ...item,
                  empreedimento: await this.getEmpreedimento(
                    item.empreedimento,
                  ),
                  financeiro: await this.getFinaceiro(item.financeiro),
                  corretor: await this.getCorretor(item.corretor),
                  createdAt: new Date(item.createdAt).toISOString(),
                  dt_aprovacao: item.dt_aprovacao
                    ? new Date(item.dt_aprovacao).toISOString()
                    : null,
                  certificado: await this.getCertificado(item.cpf, Inicio, Fim),
                };
              }),
            ),
          }),
          totalFcw: total,
          ValorTotal: total > 0 ? total * valorConst : 0,
        },
      };
    } catch (error) {
      return {
        error: true,
        message: error.message,
        data: null,
      };
    } finally {
      this.prismaService.$disconnect();
    }
  }

  // api
  async getEmpreedimento(id: number) {
    try {
      const empreedimento =
        await this.prismaService.nato_empreendimento.findFirst({
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
    } finally {
      this.prismaService.$disconnect();
    }
  }

  async getFinaceiro(id: number) {
    try {
      const financeiro = await this.prismaService.nato_financeiro.findFirst({
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
  }

  async getCorretor(id: number) {
    try {
      const corretor = await this.prismaService.nato_user.findFirst({
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
  }

  async getCertificado(
    cpf: string,
    Inicio: string,
    Fim: string,
  ): Promise<number> {
    try {
      const gepFim = new Date(Fim);
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
            gte: new Date(Inicio),
            lte: gepFim,
          },
          tipocd: {
            equals: 'A3PF Bird5000',
          },
        },
      });

      console.log('🚀 ~ ReFinanceiroService ~ certificado:', certificado);

      // Opcional: Atraso de 1 segundo (se realmente necessário)
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      await delay(1000);

      // Atualize `total` corretamente, se for global
      if (typeof total !== 'undefined') {
        total += certificado;
      }

      return certificado;
    } catch (error) {
      console.error('🚀 ~ getCertificado ~ error:', error);

      // Retorne 0 em caso de erro, se necessário
      if (typeof total !== 'undefined') {
        total += 0;
      }
      return 0;
    }
  }

  async getConstrutoraValor(id: number) {
    try {
      const construtora = await this.prismaService.nato_empresas.findUnique({
        where: {
          id: Number(id),
        },
        select: {
          valor_cert: true,
        },
      });
      this.prismaService.$disconnect();
      return !construtora?.valor_cert ? 100 : construtora?.valor_cert;
    } catch (error) {
      console.log('🚀 ~ getConstrutoraValor ~ error:', error);
      return 100;
    } finally {
      this.prismaService.$disconnect();
    }
  }
}
