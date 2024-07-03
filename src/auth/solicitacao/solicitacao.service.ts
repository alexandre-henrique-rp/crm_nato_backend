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
            ...(hierarquia === 'USER' ? { corretor: userId, ativo: true } : {}),
          },
          select: {
            id: true,
            nome: true,
            obs: true,
            dt_solicitacao: true,
            enpreedimento: true,
            construtora: true,
            corretor: true,
            id_fcw: true,
            createdAt: true,
            updatedAt: true,
            ativo: true,
          },
        });

      const data = req.map(async (item) => {
        const consulta = await this.prismaService.nato_user.findFirst({
          where: {
            id: item.corretor,
          },
          select: {
            id: true,
            nome: true,
          },
        });

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

        return {
          ...item,
          corretor: { ...consulta },
          ...(item.id_fcw && { fcweb: { ...consultaFcw } }),
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

      const req2 = await this.prismaService.nato_user.findFirst({
        where: {
          id: req.corretor,
        },
        select: {
          id: true,
          nome: true,
        },
      });

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

      const relacionamento = JSON.parse(req.relacionamento);
      const dataRelacionamento = await Promise.all(
        relacionamento.map(async (item: any) => {
          return this.GetRelacionamento(item);
        }),
      );

      const data = {
        ...req,
        corretor: {
          ...req2,
        },
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
            dt_nascimento: new Date(data.dt_nascimento).toISOString(),
            obs: data.obs,
            cnh: data.cnh,
            upload: data.upload,
            relacionamento: JSON.stringify(data.relacionamento),
            enpreedimento: data.enpreedimento,
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
            enpreedimento: true,
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
}
