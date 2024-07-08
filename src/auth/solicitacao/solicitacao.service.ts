import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SolicitacaoService {
  constructor(private prismaService: PrismaService) {}

  async findAll(userId: number, hierarquia: string) {
    try {
      const req =
        await this.prismaService.nato_solicitacoes_certificado.findMany({
          where: {
            ...(hierarquia === 'USER' && { corretor: userId, ativo: true }),
            ...(hierarquia === 'CONST' && { ativo: true }),
          },
          select: {
            id: true,
            nome: true,
            obs: true,
            dt_solicitacao: true,
            empreedimento: true,
            construtora: true,
            corretor: true,
            ass_doc: true,
            id_fcw: true,
            createdAt: true,
            updatedAt: true,
            ativo: true,
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
              razaosocial: true,
            },
          }));

        const Alerts = await this.GetAlert(item.id);

        return {
          ...item,
          corretor: { ...consulta },
          ...(Alerts.length > 0 ? { alerts: Alerts } : { alerts: [] }),
          ...(item.id_fcw && { fcweb: { ...consultaFcw } }),
          ...(item.empreedimento && { empreedimento: { empreedimento } }),
          ...(item.construtora && { construtora: { construtora } }),
        };
      });
      return Promise.all(data);
    } catch (error) {
      return error;
    }
  }

  async findOne(id: number, userId: number, hierarquia: string) {
    try {
      const Parans =
        hierarquia === 'USER'
          ? { id: id, corretor: userId, ativo: true }
          : { id: id };

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
            createdAt: true,
            updatedAt: true,
          },
        }));

      const Alerts = await this.GetAlert(req.id);

      const relacionamento = JSON.parse(req.relacionamento);
      const dataRelacionamento = await Promise.all(
        relacionamento.map(async (item: any) => {
          return this.GetRelacionamento(item);
        }),
      );

      const empreedimento = await this.GetEmpreedimento(req.empreedimento);
      const construtora = await this.GetConstrutora(req.construtora);

      const data = {
        ...req,
        alert: Alerts,
        corretor: {
          ...req2,
        },
        ...(req.empreedimento && { empreedimento: { ...empreedimento } }),
        ...(req.construtora && { construtora: { ...construtora } }),
        ...(req.id_fcw && { fcweb: { ...fichaCadastro } }),
        ...(req.relacionamento !== '[]' && {
          relacionamento: dataRelacionamento,
        }),
      };
      return data;
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async create(data: any & { userId: number }) {
    try {
      console.log(data);
      const req = await this.prismaService.nato_solicitacoes_certificado.create(
        {
          data: {
            nome: data.nome,
            email: data.email,
            telefone: data.telefone,
            cpf: data.cpf,
            dt_nascimento: data.dt_nascimento
              ? new Date(data.dt_nascimento).toISOString()
              : new Date('2024-01-01').toISOString(),
            obs: data.obs,
            cnh: data.cnh,
            uploadCnh: data.upload,
            uploadRg: data.uploadRg,
            relacionamento: JSON.stringify(data.relacionamento),
            empreedimento: data.empreedimento,
            construtora: data.construtora,
            dt_solicitacao: new Date().toISOString(),
            corretor: data.corretor,
          },
        },
      );

      console.log(req);
      return req;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  update(id: number, data: any) {
    try {
      return this.prismaService.nato_solicitacao.update({
        where: {
          id,
        },
        data: data,
      });
    } catch (error) {
      return error;
    }
  }

  delete(id: number) {
    try {
      return this.prismaService.nato_solicitacao.update({
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

  async FilterDoc(id: number) {
    try {
      return this.prismaService.nato_solicitacoes_certificado.findMany({
        where: {
          id_fcw: id,
          ativo: true,
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
            cnh: true,
            empreedimento: true,
            ass_doc: true,
            createdAt: true,
            updatedAt: true,
          },
        });
      return req;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  async GetAlert(id: number) {
    try {
      const req = await this.prismaService.nato_alerta.findMany({
        where: {
          solicitacao_id: id,
        },
      });
      return req;
    } catch (error) {
      console.log(error);
      return error;
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
          razaosocial: true,
        },
      });
      return req;
    } catch (error) {
      return error;
    }
  }
}
