import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SolicitacaoService {
  constructor(private prismaService: PrismaService
  ) { }

  async findAll(userId: number, hierarquia: string, Financeira: any, Construtora: any) {
    try {
      const Ids = Financeira.map((item: { id: any; }) => item.id);
      const ConstId = Construtora.map((i: any) => i.id)
      const req =
        await this.prismaService.nato_solicitacoes_certificado.findMany({
          where: {
            ...(hierarquia === 'USER' && { corretor: userId, ativo: true, distrato: false, financeiro: { in: Ids } }),
            ...(hierarquia === 'CONST' && { financeiro: { in: Ids }, ativo: true, construtora: { in: ConstId } }),
            ...(hierarquia === 'GRT' && { financeiro: { in: Ids }, ativo: true, construtora: { in: ConstId } }),
            ...(hierarquia === 'CCA' && { financeiro: { in: Ids }, ativo: true, construtora: { in: ConstId } }),
          },
          select: {
            id: true,
            nome: true,
            dt_solicitacao: true,
            empreedimento: true,
            construtora: true,
            corretor: true,
            cpf: true,
            distrato: true,
            id_fcw: true,
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

        const consultaFcw: any = await this.GetFicha(item.cpf);

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
          ...(consultaFcw && { fcweb: { ...consultaFcw, validacao: consultaFcw.validacao && consultaFcw.validacao.split(' ')[0], andamento: consultaFcw.andamento === "NOVA FC" ? "INICIADO" : consultaFcw.andamento } }),
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

  /**
   * Retorna uma solicita o de certificado pelo ID.
   *
   * @param id ID da solicita o.
   * @param userId ID do usu rio que esta realizando a busca.
   * @param hierarquia Hierarquia do usu rio que esta realizando a busca. Os valores poss veis s o:
   * - USER
   * - CONST
   * - GRT
   * - CCA
   * @param Financeira Array com os IDs das financeiras do usu rio.
   * @returns O registro encontrado.
   */
  async findOne(id: number, userId: number, hierarquia: string, Financeira: any) {
    try {
      const Ids = Financeira.map((item: { id: any; }) => item.id);

      const req =
        await this.prismaService.nato_solicitacoes_certificado.findFirst({
          where: {
            id,
            ...(hierarquia === 'USER' && { corretor: userId, ativo: true, financeiro: { in: Ids } }),
            ...(hierarquia === 'CONST' && { financeiro: { in: Ids }, ativo: true }),
            ...(hierarquia === 'GRT' && { financeiro: { in: Ids }, ativo: true }),
            ...(hierarquia === 'CCA' && { financeiro: { in: Ids }, ativo: true }),
          }
        });

      const req2 = req.corretor && await this.GetCorretor(req.corretor);
      const fichaCadastro = await this.GetFicha(req.cpf);
      const relacionamentoVerifica = !req.rela_quest ? [] : JSON.parse(req.relacionamento);
      const dataRelacionamento = await Promise.all(relacionamentoVerifica.map(async (item: any) => await this.GetRelacionamento(item)));
      console.log("🚀 ~ SolicitacaoService ~ findOne ~ dataRelacionamento:", dataRelacionamento)
      const empreedimento = await this.GetEmpreedimento(req.empreedimento);
      const construtora = await this.GetConstrutora(req.construtora);
      const financeira = await this.getFinanceiro(req.financeiro);

      const data = {
        ...req,
        ...(req.corretor && { corretor: { ...req2 } }),
        ...(req.financeiro && { financeiro: { ...financeira } }),
        ...(req.empreedimento && { empreedimento: { ...empreedimento } }),
        ...(req.construtora && { construtora: { ...construtora } }),
        ...(fichaCadastro && { fcweb: { ...fichaCadastro } }),
        ...(req.rela_quest ? { relacionamento: { ...dataRelacionamento } } : { relacionamento: [] }),
      };
      console.log("🚀 ~ SolicitacaoService ~ findOne ~ req.rela_quest:", req.rela_quest)
      console.log("🚀 ~ SolicitacaoService ~ findOne ~ data:", data)
      return data;
    } catch (error) {
      console.error(error.message);
      return error.message;
    }
  }

  /**
   * Cria uma nova solicita o de certificado.
   *
   * @param data Dados da solicita o.
   * @param sms Se true, envia mensagens de texto para o cliente.
   * @returns O registro criado.
   */
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
        await this.GetCorretor(data.corretor),
      ])

      const [empreedimento] = await Promise.all([
        await this.GetEmpreedimento(data.empreedimento),
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

  /**
   * Atualiza uma solicita o de certificado.
   * 
   * @param id ID da solicita o.
   * @param data Dados a serem atualizados.
   * @param user Usu rio que esta fazendo a atualiza o.
   * @returns O registro atualizado.
   */
  async update(id: number, data: any, user: any) {
    try {
      const req =
        await this.prismaService.nato_solicitacoes_certificado.findFirst({
          where: {
            id,

          },
          select: {
            ativo: true,
            logDelete: true,
          },
        });

      const dados = {
        ...data,
        ...(data.relacionamento && { relacionamento: JSON.stringify(data.relacionamento), }),
        ...(data.dt_nascimento && { dt_nascimento: new Date(data.dt_nascimento).toISOString(), }),
        ...(data.logDelete && { logDelete: `${data.logDelete}\nO usuário: ${user?.nome}, id: ${user?.id} editou esse registro em: ${new Date().toLocaleDateString('pt-BR')} as ${new Date().toLocaleTimeString('pt-BR')}` }),
        ...(req.logDelete && !data.logDelete && { logDelete: `${req.logDelete}\nO usuário: ${user?.nome}, id: ${user?.id} editou esse registro em: ${new Date().toLocaleDateString('pt-BR')} as ${new Date().toLocaleTimeString('pt-BR')}` }),
        ...(!data.logDelete && !req.logDelete && { logDelete: `${user?.nome}, id: ${user?.id} editou esse registro em: ${new Date().toLocaleDateString('pt-BR')} as ${new Date().toLocaleTimeString('pt-BR')}` })
      }



      const update = await this.prismaService.nato_solicitacoes_certificado.update({
        where: {
          id: Number(id),
        },
        data: {
          ...dados
        },
      });
      return update;
    } catch (error) {
      console.error(error);
      console.error(error.message);
      return error;
    }
  }

  /**
   * Deleta uma solicita o de certificado.
   *
   * @param id ID da solicita o.
   * @param user Usu rio que esta fazendo a dele o.
   * @returns O registro deletado.
   * @throws {Error} Se a solicita o j  foi deletada.
   */
  async delete(id: number, user: any) {
    try {
      const req =
        await this.prismaService.nato_solicitacoes_certificado.findFirst({
          where: {
            id,

          },
          select: {
            ativo: true,
            logDelete: true,
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
          logDelete: `${req.logDelete}\nO usuário: ${user?.nome}, id: ${user?.id} deletou esse registro em: ${new Date().toLocaleDateString('pt-BR')} as ${new Date().toLocaleTimeString('pt-BR')}`,
        },
      });
    } catch (error) {
      return error.message;
    }
  }



  /**
   * Retorna todas as solicitações de certificado com paginação e filtragem.
   *
   * @param pagina número da página a ser retornada
   * @param limite quantidade de registros a serem retornados por página
   * @param filtro objeto com os campos a serem filtrados. Os campos possíveis são:
   * - nome: string com o nome do corretor
   * - id: número com o ID do corretor
   * - andamento: string com o andamento da solicitação. Os valores possíveis são:
   *   - INICIADO
   *   - APROVADO
   *   - EMITIDO
   *   - REVOGADO
   * - construtora: número com o ID da construtora
   * - empreedimento: número com o ID do empreendimento
   * - financeiro: número com o ID do financeiro
   * @param UserData objeto com informações do usuário logado. Os campos necessários são:
   * - hierarquia: string com a hierarquia do usuário. Os valores possíveis são:
   *   - USER = usuário
   *   - CONST = construtora
   *   - GRT = gerente
   *   - CCA = financeira
   * - Financeira: array com objetos contendo o ID da financeira
   * - construtora: array com objetos contendo o ID da construtora
   * @returns objeto com dois campos: Total (número com a quantidade total de registros) e Filter (array com os registros filtrados)
   */
  async GetAllPaginationAndFilter(pagina: number, limite: number, filtro: any, UserData: any) {
    try {
      const { nome, id, andamento, construtora, empreendimento, financeiro } = filtro;
      const PaginaAtual = pagina || 1;
      const Limite = limite ? limite : !!andamento ? 50 : 20;
      const Offset = (PaginaAtual - 1) * Limite;
      const Ids = UserData.Financeira.map((item: { id: any; }) => String(item.id));
      const ConstId = UserData.construtora.map((i: { id: any; }) => i.id);

      const count = await this.prismaService.nato_solicitacoes_certificado.count({
        where: {
          ...(UserData.hierarquia === 'USER' && {
            corretor: UserData.id,
            ativo: true,
            distrato: false,
            financeiro: { in: Ids },
          }),
          ...(UserData.hierarquia === 'CONST' && {
            financeiro: { in: Ids },
            ativo: true,
            construtora: { in: ConstId },
          }),
          ...(UserData.hierarquia === 'GRT' && {
            financeiro: { in: Ids },
            ativo: true,
            construtora: { in: ConstId },
          }),
          ...(UserData.hierarquia === 'CCA' && {
            financeiro: { in: Ids },
            ativo: true,
            construtora: { in: ConstId },
          }),
          ...(nome && { nome: { contains: nome } }),
          ...(id && { id: { equals: Number(id) } }),
          ...(construtora && { construtora: { in: ConstId } }),
          ...(empreendimento && { empreendimento: { in: ConstId } }),
          ...(financeiro && { financeiro: { in: Ids } }),
        },
      });


      const req = await this.prismaService.nato_solicitacoes_certificado.findMany({
        where: {
          ...(UserData.hierarquia === 'USER' && {
            corretor: UserData.id,
            ativo: true,
            distrato: false,
            financeiro: { in: Ids },
          }),
          ...(UserData.hierarquia === 'CONST' && {
            financeiro: { in: Ids },
            ativo: true,
            construtora: { in: ConstId },
          }),
          ...(UserData.hierarquia === 'GRT' && {
            financeiro: { in: Ids },
            ativo: true,
            construtora: { in: ConstId },
          }),
          ...(UserData.hierarquia === 'CCA' && {
            financeiro: { in: Ids },
            ativo: true,
            construtora: { in: ConstId },
          }),
          ...(nome && { nome: { contains: nome } }),
          ...(id && { id: { equals: Number(id) } }),
          ...(Number(construtora) > 0 && { construtora: { equals: Number(construtora) } }),
          ...(Number(empreendimento) > 0 && { empreendimento: { equals: Number(empreendimento) } }),
          ...(financeiro && { financeiro: { equals: Number(financeiro) } }),
        },
        orderBy: {
          id: 'desc',
        },
        skip: Offset,
        take: Limite,
      });

      const data = await Promise.all(
        req.map(async item => {
          const DataRelacionamento = item.rela_quest || item.relacionamento !== null ? JSON.parse(item.relacionamento) : [];
          const relacionamentoDb = await Promise.all(
            DataRelacionamento.map(async (rel: any) => await this.GetRelacionamento(rel))
          );
          const construtoraDb = await this.GetConstrutora(Number(item.construtora));
          const empreendimentoDb = await this.GetEmpreedimento(Number(item.empreedimento));
          const CorretorDb = await this.GetCorretor(item.corretor);
          const ConsultaFcWeb: any = await this.GetFicha(item.cpf);
          const consultaFinanceira: any = await this.getFinanceiro(item.financeiro);

          return {
            ...item,
            ...(ConsultaFcWeb && {
              fcweb: {
                ...ConsultaFcWeb,
                validacao: ConsultaFcWeb.validacao?.split(' ')[0],
                andamento: ConsultaFcWeb.andamento === 'NOVA FC' ? 'INICIADO' : ConsultaFcWeb.andamento,
              },
            }),
            ...(item.empreedimento && { empreendimento: { ...empreendimentoDb } }),
            ...(item.construtora && { construtora: { ...construtoraDb } }),
            ...(item.financeiro && { financeiro: { ...consultaFinanceira } }),
            ...(item.rela_quest ? { relacionamento: { ...relacionamentoDb } }: { relacionamento: [] }),
            ...(item.corretor && { corretor: { ...CorretorDb } }),
          };
        }),
      );


      const Filter = andamento
        ? andamento !== 'VAZIO'
          ? data.filter(item => item.fcweb?.andamento?.toLowerCase().includes(andamento.toLowerCase()))
          : data.filter(item => !item.fcweb)
        : data;

      const Total = count;


      return { total: Total, data: Filter, pagina: PaginaAtual, limite: Limite };
    } catch (error) {
      console.error('Erro na função GetAllPaginationAndFilter:', error); // Logando erro completo para depuração
      return error.message;
    }
  }


  //-------------------------------------------------------------------------------------------------------
  /**
   * Filtra as solicita es por CPF.
   *
   * @param doc CPF a ser filtrado.
   * @returns Uma lista de solicita es que correspondem ao CPF informado.
   */
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

  // /**
  //  * Filtra as solicita es por data.
  //  *
  //  * @param data objeto com datas no formato ISO. O objeto deve ter as seguintes propriedades:
  //  * - inicio: data de incio da busca.
  //  * - fim: data de fim da busca.
  //  * - rengInit: data de incio do registro.
  //  * - rengEnd: data de fim do rengimento.
  //  * @returns Uma lista de solicita es que correspondem as datas informadas.
  //  */
  // async FilterDate(data: any) {
  //   try {
  //     return this.prismaService.nato_solicitacoes_certificado.findMany({
  //       where: {
  //         ...data,
  //         ativo: true,
  //       },
  //     });
  //   } catch (error) {
  //     return error.message;
  //   }
  // }

  /**
   * Retorna um objeto com informa es sobre o relacionamento do titular da solicita o.
   *
   * @param cpf CPF do titular da solicita o.
   * @returns Um objeto com as seguintes propriedades:
   * - id: ID da solicita o.
   * - nome: Nome do titular da solicita o.
   * - email: Email do titular da solicita o.
   * - telefone: Telefone do titular da solicita o.
   * - cpf: CPF do titular da solicita o.
   * - dt_nascimento: Data de nascimento do titular da solicita o.
   * - ass_doc: Documento de assinatura do titular da solicita o.
   * - createdAt: Data de cria o da solicita o.
   */
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
            ass_doc: true,
            createdAt: true,
          },
        });
      return req;
    } catch (error) {
      console.error(error.message);
      return error.message;
    }
  }

  /**
   * Retorna todas as alertas de uma solicita o.
   *
   * @param id ID da solicita o.
   * @returns Uma lista de alertas.
   * {id: number, titulo: 'string', mensagem: 'string', status: boolean, createdAt: Date}
   */
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

  /**
   * Retorna o empreendimento de uma solicita o.
   *
   * @param id ID da solicita o.
   * @returns O empreendimento da solicita o.
   * {id: number, nome: 'string, cidade: 'string', uf: 'string', tag: 'string'}
   */
  async GetEmpreedimento(id: number) {
    try {
      const req = await this.prismaService.nato_empreendimento.findFirst({
        where: {
          id: id,
        },
        select: {
          id: true,
          nome: true,
          cidade: true,
          uf: true,
          tag: true,
        },
      });
      return req;
    } catch (error) {
      return error;
    }
  }

  /**
   * Retorna a construtora de uma solicita o.
   *
   * @param id ID da solicita o.
   * @returns A construtora da solicita o.
   * {id: number, fantasia: string}
   */
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

  /**
   * Retorna o corretor de uma solicita o.
   *
   * @param id ID da solicita o.
   * @returns O corretor da solicita o.
   * {id: number, nome: string, telefone: string}
   */
  async GetCorretor(id: number) {
    try {
      const req = await this.prismaService.nato_user.findFirst({
        where: {
          id: id,
        },
        select: {
          id: true,
          nome: true,
          telefone: true,
        },
      });
      return req;
    } catch (error) {
      return error;
    }
  }

  /**
   * Retorna a financeira de uma solicita o.
   *
   * @param id ID da solicita o.
   * @returns A financeira da solicita o.
   * {id: number, fantasia: string}
   */
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

  /**
   * Envia um SMS para um n mero de telefone.
   *
   * @param number N mero de telefone sem o d digo do pa s (55).
   * @param message Mensagem a ser enviada.
   * @returns A resposta da API.
   */
  async SendWhatsapp(number: string, message: string) {
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

      return await response.json();
    } catch (error) {
      console.log("error send sms", error);
      return error;
    }
  }

  /**
   * Envia um SMS para um n mero de telefone com um termo de compromisso.
   *
   * @param number N mero de telefone sem o d digo do pa s (55).
   * @param message Mensagem a ser enviada.
   * @returns A resposta da API.
   */
  async SendTermo(number: string, message: string) {
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
      return await response.json();
    } catch (error) {
      console.log("error send sms", error);
      return error;
    }
  }

  /**
   * Retorna a ficha de um corretor dado o CPF.
   *
   * @param cpf CPF do corretor.
   * @returns A ficha do corretor com os campos:
   * - id: ID da ficha.
   * - andamento: Andamento da ficha.
   * - dt_agenda: Data de agendamento da ficha.
   * - hr_agenda: Hora de agendamento da ficha.
   * - valorcd: Valor do CD da ficha.
   * - estatos_pgto: Status de pagamento da ficha.
   * - createdAt: Data de cria o da ficha.
   * - vouchersoluti: Voucher de soluti o da ficha.
   * - validacao: Status de valida o da ficha.
   */
  async GetFicha(cpf: string) {
    try {
      const request = await this.prismaService.fcweb.findFirst({
        where: {
          cpf: cpf,
          contador: { contains: "NATO_" }
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
          vouchersoluti: true,
          validacao: true,
        },
      })
      return request
    } catch (error) {
      const request = await this.prismaService.fcweb.findFirst({
        where: {
          cpf: cpf,
          contador: { contains: "NATO_" }
        },
        select: {
          id: true,
          andamento: true,
          dt_agenda: true,
          hr_agenda: true,
          valorcd: true,
          estatos_pgto: true,
          createdAt: true,
          vouchersoluti: true,
          validacao: true,
        },
      })
      return request
    }
  }


}
