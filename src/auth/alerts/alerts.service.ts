import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(private prismaService: PrismaService) { }

  async Create(data: any, hierarquia: string) {
    try {
      const request = await this.prismaService.nato_alerta.create({
        ...(hierarquia === 'USER' ? { data: data } : { data: { ...data } }),
      });

      if (!!data.corretor) {
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
        await Promise.all([
          await this.SendWhatsapp(vendedor.telefone, `🚨🚨🚨*Sis Nato Informa*🚨🚨🚨\n\ncliente: ${data.titulo}\n${data.texto}`),
          // await this.Relatorio(data.empreendimento, `${data.titulo}-${data.texto} - Vendedor: ${vendedor.nome}`),
        ])
      }

      return request;
    } catch (error) {
      console.error(error.message);
      return error.message;
    }
  }

  async GetAll(hierarquia: string, userId: number) {
    try {
      const req = await this.prismaService.nato_alerta.findMany({
        where: {
          ...(hierarquia === 'USER'
            ? {
              OR: [
                {
                  solicitacao_id: {
                    equals: null,
                  }
                }, {
                  corretor: Number(userId)
                }

              ],
              status: true,

            }
            : {}),
        },
        orderBy: {
          createdAt: 'desc',
        }
      });

      return req
    } catch (error) {
      console.error(error.message);
      return error.message;
    }
  }

  async GetAllUser(id: number) {
    try {
      return this.prismaService.nato_alerta.findMany({
        where: {
          corretor: id,
          status: true,
        },
        orderBy: {
          createdAt: 'desc',
        }
      });
    } catch (error) {
      console.error(error.message);
      return error.message;
    }
  }

  async GetAllSolicitacao(id: number) {
    try {
      return this.prismaService.nato_alerta.findMany({
        where: {
          solicitacao_id: id,
          status: true,
        },
        orderBy: {
          createdAt: 'desc',
        }
      });
    } catch (error) {
      console.error(error.message);
      return error.message;
    }
  }

  async Update(id: number, data: any) {
    try {
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

      await Promise.all([
        await this.SendWhatsapp(vendedor.telefone, `Atualização: ${data.titulo}-${data.texto}`),
        // await this.Relatorio(data.empreendimento, `Atualização: ${data.titulo}-${data.texto} - Vendedor: ${vendedor.nome}`),
      ])
      return await this.prismaService.nato_alerta.update({
        where: {
          id: Number(id),
        },
        data,
      });
    } catch (error) {
      console.error(error.message);
      return error.message;
    }
  }

  async Delete(id: number) {
    try {
      const request = await this.prismaService.nato_alerta.update({
        where: {
          id: Number(id),
        },
        data: {
          status: false,
        },
      });

      return request;
    } catch (error) {
      console.error(error.message);
      return error.message;
    }
  }

  async GetSolicitacaoAlerta(DataUser: any, id: number) {
    try {
      const request = await this.prismaService.nato_alerta.findMany({
        where: {
          solicitacao_id: id,
          status: true,
          ...(DataUser.hierarquia === 'USER' && { corretor: DataUser.id }),
        },
        orderBy: {
          createdAt: 'desc',
        }
      });
      return request
    } catch (error) {
      return error.message;
    }
  }
  //-----------------------------------------------

  SendWhatsapp = async (number: string, message: string) => {
    try {
      const response = await fetch(
        `https://api.inovstar.com/core/v2/api/chats/send-text`, {
        method: "POST",
        headers: {
          "access-token": '60de0c8bb0012f1e6ac5546b',
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          number: '55' + number,
          message: message,
          forceSend: true,
          verifyContact: false,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  Relatorio = async (EmpreendimentoId: number, message: string) => {
    try {
      const request = await this.prismaService.nato_user.findMany({
        where: {
          sms_relat: false,
          empreendimento: {
            contains: EmpreendimentoId.toString()
          },
          cargo: {
            contains: "financeiro"
          }
        },
        select: {
          id: true,
          nome: true,
          telefone: true,
        },
      });

      for (let i = 0; i < request.length; i++) {
        const element = request[i];
        this.SendWhatsapp(element.telefone, message);
      }

      return request;
    } catch (error) {
      console.error(error.message);
      return error.message;
    }
  }
}
