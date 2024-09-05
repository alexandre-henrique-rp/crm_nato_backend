import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { createUserDto } from './dto/create_user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) { }

  create(dados: createUserDto) {
    try {
      return this.prismaService.nato_user.create({
        data: {
          ...dados,
          username: dados.username.toUpperCase(),
          password: dados.password,
          password_key: this.generateHash(dados.password),
          email: dados.email,
          telefone: dados.telefone,
          cpf: dados.cpf,
          nome: dados.nome.toUpperCase(),
          construtora: JSON.stringify(dados.construtora),
          empreendimento: JSON.stringify(dados.empreendimento),
          hierarquia: dados.hierarquia,
          cargo: dados.cargo,
          Financeira: JSON.stringify(dados.Financeira),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  findOne(UserId: number | string) {
    try {
      return this.prismaService.nato_user.findFirst({
        where: {
          ...(typeof UserId === 'number'
            ? { id: UserId }
            : { username: UserId }),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const req = await this.prismaService.nato_user.findMany();
      const data = await Promise.all(
        req.map(async (data: any) => {
          const construtoraDb = await this.prismaService.nato_empresas.findMany(
            {
              where: {
                id: {
                  in: JSON.parse(data.construtora),
                },
              },
            },
          );

          const empreendimentoDb =
            await this.prismaService.nato_empreendimento.findMany({
              where: {
                id: {
                  in: JSON.parse(data.empreendimento),
                },
              },
            });

          return {
            ...data,
            construtora: construtoraDb,
            empreendimento: empreendimentoDb,
          };
        }),
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  update(id: number, data: any) {
    try {
      return this.prismaService.nato_user.update({
        where: {
          id: Number(id),
        },
        data,
      });
    } catch (error) {
      throw error;
    }
  }

  delete(id: number) {
    try {
      return this.prismaService.nato_user.delete({
        where: {
          id: Number(id),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  findByCpf(cpf: string) {
    try {
      return this.prismaService.nato_user.findFirst({
        where: {
          cpf,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  findByid(id: number) {
    try {
      return this.prismaService.nato_user.findFirst({
        where: {
          id: Number(id),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  updatePassword(id: number, password: string) {
    try {
      return this.prismaService.nato_user.update({
        where: {
          id,
        },
        data: {
          password: password,
          password_key: this.generateHash(password),
          reset_password: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // gerar hash
  generateHash(password: string) {
    return bcrypt.hashSync(password, 10);
  }

  primeAcess(id: number, data: any) {
    try {
      const Senha = this.generateHash(data.password);
      return this.prismaService.nato_user.update({
        where: {
          id: Number(id),
        },
        data: {
          password: data.password,
          password_key: Senha,
          reset_password: false,
        },
      });
    } catch (error) {
      return error;
    }
  }

  async CCA(EmpreendimentoId: number) {
    try {
      return await this.prismaService.nato_user.findMany({
        where: {
          sms_relat: false,
          empreendimento: {
            contains: EmpreendimentoId.toString()
          },
          OR: [
            {
              cargo: {
                contains: "financeiro"
              }
            },
            {
              cargo: {
                contains: "CCA"
              }
            }
          ]
        },
        select: {
          id: true,
          nome: true,
          telefone: true,
        },
      })
    } catch (error) {
      return error
    }
  }
}
