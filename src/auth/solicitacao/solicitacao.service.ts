import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SolicitacaoService {
  constructor(private prismaService: PrismaService) {}

  async findAll(userId: number | string, hierarquia: string) {
    try {
      return await this.prismaService.nato_solicitacao.findMany({
        where: {
          ...(hierarquia === 'USER' ? { corretor: userId, ativo: true } : {}),
        },
        include: {
          corretor: true,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async findOne(id: number, userId: number, hierarquia: string) {
    try {
      const req =
        await this.prismaService.nato_solicitacoes_certificado.findFirst({
          where: {
            ...(hierarquia === 'USER'
              ? { id: id, corretor: userId, ativo: true }
              : { id: id }),
          },
        });

      const req2 = await this.prismaService.nato_user.findFirst({
        where: {
          id: req.corretor,
        },
      });

      const data = {
        ...req,
        corretor: {
          ...req2,
        },
      };
      return data;
    } catch (error) {
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
            corretor: data.userId,
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

  update(id: string, data: any & { userId: number }) {
    try {
      return this.prismaService.nato_solicitacao.update({
        where: {
          id,
          corretor: data.userId,
        },
        data: data,
      });
    } catch (error) {
      return error;
    }
  }

  delete(id: string, userId: number) {
    try {
      return this.prismaService.nato_solicitacao.update({
        where: {
          id,
          corretor: userId,
        },
        data: {
          ativo: false,
          corretor: null,
        },
      });
    } catch (error) {
      return error;
    }
  }
}
