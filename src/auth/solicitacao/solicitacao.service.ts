import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SolicitacaoService {
  constructor(private prismaService: PrismaService
  ) { }

  async findAll(userId: number, hierarquia: string, Financeira: any) {
    try {
      const Ids = Financeira.map((item: { id: any; }) => item.id);
      const req =
        await this.prismaService.nato_solicitacoes_certificado.findMany({
          where: {
            ...(hierarquia === 'USER' && { corretor: userId, ativo: true, distrato: false, financeiro: { in: Ids } }),
            ...(hierarquia === 'CONST' && { financeiro: { in: Ids }, ativo: true }),
          },
          select: {
            id: true,
            nome: true,
            dt_solicitacao: true,
            empreedimento: true,
            construtora: true,
            corretor: true,
            id_fcw: true,
            distrato: true,
            ativo: true,
            financeiro: true,
          },
          orderBy: {
            id: 'desc',
          },
        });

      const data = req.map(async (item) => {
        const consulta =
          item.corretor &&
          (await this.prismaService.nato_user.findFirst({
            where: {
              id: item.corretor,
            },
            select: {
              id: true,
              nome: true,
            },
          }));

        const consultaFinanceira =
          item.financeiro &&
          (await this.prismaService.nato_financeiro.findFirst({
            where: {
              id: item.financeiro,
            },
            select: {
              id: true,
              fantasia: true,
            },
          }));

        const consultaFcw =
          item.id_fcw &&
          (await this.prismaService.fcweb.findFirst({
            where: {
              id: item.id_fcw,
            },
            select: {
              id: true,
              andamento: true,
              dt_agenda: true,
              hr_agenda: true,
              valorcd: true,
              estatos_pgto: true,
              dt_aprovacao: true,
              validacao: true,
            },
          }));


        const empreedimento =
          item.empreedimento &&
          (await this.prismaService.nato_empreendimento.findFirst({
            where: {
              id: item.empreedimento,
            },
            select: {
              id: true,
              nome: true,
            },
          }));

        const construtora =
          item.construtora &&
          (await this.prismaService.nato_empresas.findFirst({
            where: {
              id: item.construtora,
            },
            select: {
              id: true,
              fantasia: true,
            },
          }));

        const Alerts = await this.GetAlert(item.id);

        return {
          ...item,
          corretor: { ...consulta },
          ...(Alerts.length > 0 ? { alerts: Alerts } : { alerts: [] }),
          ...(item.id_fcw && { fcweb: { ...consultaFcw, validacao: consultaFcw.validacao.split(' ')[0], andamento: consultaFcw.andamento === "NOVA FC" ? "INICIADO" : consultaFcw.andamento } }),
          ...(item.empreedimento && { empreedimento: { ...empreedimento } }),
          ...(item.construtora && { construtora: { ...construtora } }),
          ...(item.financeiro && { financeiro: { ...consultaFinanceira } }),
        };
      });
      return Promise.all(data);
    } catch (error) {
      console.error(error.message);
      return error.message;
    }
  }

  async findOne(id: number, userId: number, hierarquia: string, Financeira: any) {
    try {
      const Ids = Financeira.map((item: { id: any; }) => item.id);
      const Parans =
        hierarquia === 'USER'
          ? { id: id, corretor: userId, ativo: true, financeiro: { in: Ids } }
          : hierarquia === 'CONST' ? { id: id, financeiro: { in: Ids } } : { id: id };

      const req =
        await this.prismaService.nato_solicitacoes_certificado.findFirst({
          where: Parans,
        });

      if (!req) {
        throw new Error('Request not found');
      }

      const req2 =
        req.corretor &&
        (await this.prismaService.nato_user.findFirst({
          where: {
            id: req.corretor,
          },
          select: {
            id: true,
            nome: true,
          },
        }));

      const fichaCadastro =
        req.id_fcw &&
        (await this.prismaService.fcweb.findFirst({
          where: {
            id: req.id_fcw,
          },
          select: {
            id: true,
            andamento: true,
            dt_agenda: true,
            hr_agenda: true,
            valorcd: true,
            estatos_pgto: true,
            dt_aprovacao: true,
            createdAt: true,
            updatedAt: true,
            vouchersoluti: true
          },
        }));

      const Alerts = await this.GetAlert(req.id);

      const relacionamento =
        req.relacionamento === null ? [] : JSON.parse(req.relacionamento);
      const dataRelacionamento = req.rela_quest ? await Promise.all(
        relacionamento.map(async (item: any) => {
          return this.GetRelacionamento(item);
        }),
      ) : [];

      const empreedimento = await this.GetEmpreedimento(req.empreedimento);
      const construtora = await this.GetConstrutora(req.construtora);

      const financeira = await this.getFinanceiro(req.financeiro);

      const data = {
        ...req,
        alert: Alerts,
        corretor: {
          ...req2,
        },
        ...(req.financeiro && { financeiro: { ...financeira } }),
        ...(req.empreedimento && { empreedimento: { ...empreedimento } }),
        ...(req.construtora && { construtora: { ...construtora } }),
        ...(req.id_fcw && { fcweb: { ...fichaCadastro } }),
        relacionamento: dataRelacionamento,
      };
      return data;
    } catch (error) {
      console.error(error.message);
      return error.message;
    }
  }

  async create(data: any, sms: string) {
    try {
      const dados = {
        ...data,
        dt_nascimento: data.dt_nascimento
          ? new Date(data.dt_nascimento).toISOString()
          : new Date('2024-01-01').toISOString(),
        relacionamento: !data.relacionamento
          ? JSON.stringify([])
          : JSON.stringify(data.relacionamento),
        dt_solicitacao: new Date().toISOString(),
        ativo: true,
      };
      const [vendedor] = await Promise.all([
        await this.prismaService.nato_user.findUnique({
          where: {
            id: data.corretor,
          },
          select: {
            id: true,
            nome: true,
            telefone: true,
          },
        }),
      ])


      const [empreedimento] = await Promise.all([
        await this.prismaService.nato_empreendimento.findUnique({
          where: {
            id: Number(data.empreedimento)
          },
          select: {
            id: true,
            nome: true
          }
        })
      ])


      const Msg = `Ola *${data.nome}*, tudo bem?!\n\nSomos a *Rede Brasil RP*, e à pedido de ${vendedor.nome} estamos entrando em contato referente ao seu novo empreendimento${empreedimento?.nome ? `, em *${empreedimento?.nome}*` : ''}.\nPrecisamos fazer o seu certificado digital para que você possa assinar o contrato e assim prosseguir para a próxima etapa.\n\nPara mais informações, responda essa mensagem, ou aguarde segundo contato.`;

      const TermoDeUso = `TERMO DE CIÊNCIA\n\nCaro *${data.nome}*,\n\nInformamos que a assinatura fornecida será EXCLUSIVAMENTE utilizada para:\n\n1. Assinatura de contratos junto ao Correspondente da CAIXA.\n2. Abertura de fichas e assinatura de contratos junto à CAIXA ECONÔMICA FEDERAL.\n\nAtenciosamente,\nTime *INTERFACE certificadora* (REDE BRASIL RP)`


      if (sms === 'true' && data.telefone) {
        await Promise.all([
          await this.SendWhatsapp(data.telefone, Msg),
          await this.SendTermo(data.telefone, TermoDeUso),
        ]);
      }

      if (sms === 'true' && data.telefone2) {
        await Promise.all([
          await this.SendWhatsapp(data.telefone2, Msg),
          await this.SendTermo(data.telefone, TermoDeUso),
        ]);
      }

      const req = await this.prismaService.nato_solicitacoes_certificado.create(
        {
          data: dados,
        },
      );
      return req;
    } catch (error) {
      console.error(error.message);
      return error;
    }
  }

  async update(id: number, data: any) {
    try {
      const req = await this.prismaService.nato_solicitacoes_certificado.update({
        where: {
          id: Number(id),
        },
        data: {
          ...data,
          ...(data.relacionamento && { relacionamento: JSON.stringify(data.relacionamento), }),
          ...(data.dt_nascimento && { dt_nascimento: new Date(data.dt_nascimento).toISOString(), }),
        },
      });
      return req;
    } catch (error) {
      return error;
    }
  }

  async delete(id: number) {
    try {
      const req =
        await this.prismaService.nato_solicitacoes_certificado.findFirst({
          where: {
            id,
          },
          select: {
            ativo: true,
          },
        });

      if (req.ativo === false) {
        throw new Error('Solicitação ja deletada');
      }

      return this.prismaService.nato_solicitacoes_certificado.update({
        where: {
          id,
        },
        data: {
          ativo: false,
          corretor: null,
        },
      });
    } catch (error) {
      return error.message;
    }
  }

  async FilterDoc(doc: string) {
    try {
      return this.prismaService.nato_solicitacoes_certificado.findMany({
        where: {
          cpf: doc
        },
      });
    } catch (error) {
      return error.message;
    }
  }

  async FilterDate(data: any) {
    try {
      return this.prismaService.nato_solicitacoes_certificado.findMany({
        where: {
          ...data,
          ativo: true,
        },
      });
    } catch (error) {
      return error.message;
    }
  }

  async GetRelacionamento(cpf: string) {
    try {
      const req =
        await this.prismaService.nato_solicitacoes_certificado.findFirst({
          where: {
            cpf: cpf,
            ativo: true,
          },
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            cpf: true,
            dt_nascimento: true,
            obs: true,
            // cnh: true,
            // empreedimento: true,
            ass_doc: true,
            createdAt: true,
            updatedAt: true,
            // financeiro: true,
          },
        });
      return !req[0] ? [] : req;
    } catch (error) {
      console.error(error.message);
      return error.message;
    }
  }

  async GetAlert(id: number) {
    try {
      const req = await this.prismaService.nato_alerta.findMany({
        where: {
          solicitacao_id: id,
          status: true,
        },
      });
      return req;
    } catch (error) {
      console.error(error.message);
      return error.message;
    }
  }

  async GetEmpreedimento(id: number) {
    try {
      const req = await this.prismaService.nato_empreendimento.findFirst({
        where: {
          id: id,
        },
        select: {
          id: true,
          nome: true,
        },
      });
      return req;
    } catch (error) {
      return error;
    }
  }

  async GetConstrutora(id: number) {
    try {
      const req = await this.prismaService.nato_empresas.findFirst({
        where: {
          id: id,
        },
        select: {
          id: true,
          fantasia: true,
        },
      });
      return req;
    } catch (error) {
      return error;
    }
  }

  async getFinanceiro(id: number) {
    try {
      return await this.prismaService.nato_financeiro.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          fantasia: true,
        }
      });
    } catch (error) {
      return {};
    }
  }

  SendWhatsapp = async (number: string, message: string) => {
    try {
      const response = await fetch(
        `https://api.inovstar.com/core/v2/api/chats/create-new`,

        {
          headers: {
            "access-token": '60de0c8bb0012f1e6ac5546b',
            "Content-Type": 'application/json'
          },
          method: "POST",
          body: JSON.stringify({
            number: '55' + number,
            message: message,
            sectorId: "60de0c8bb0012f1e6ac55473",
          },),
        }
      );
      console.log(await response.json());
      return await response.json();
    } catch (error) {
      console.log("error send sms", error);
      return error;
    }
  }

  SendTermo = async (number: string, message: string) => {
    try {
      const response = await fetch(
        `https://api.inovstar.com/core/v2/api/chats/send-text`,

        {
          headers: {
            "access-token": '60de0c8bb0012f1e6ac5546b',
            "Content-Type": 'application/json'
          },
          method: "POST",
          body: JSON.stringify({
            number: '55' + number,
            message: message,
          },),
        }
      );
      console.log(await response.json());
      return await response.json();
    } catch (error) {
      console.log("error send sms", error);
      return error;
    }
  }

}
