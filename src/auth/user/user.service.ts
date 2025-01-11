import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create_user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) { }

  async create(dados: CreateUserDto) {
    try {
      const UsuarioExist = await this.prismaService.nato_user.findFirst({
        where: {
          username: dados.username
        }
      })

      if (UsuarioExist) {
        return {error: true, message: 'Usuário já cadastrado', data: null}
      }

      if(dados.password != dados.passwordConfir){
        return {error: true, message: 'Senhas não conferem', data: null}
      }

      const cpfExist = await this.prismaService.nato_user.findFirst({
        where:{
          cpf: dados.cpf
        }
      })

      if (cpfExist) {
        return {error: true, message: 'CPF já cadastrado', data: null}
      }

      const req =  await this.prismaService.nato_user.create({
        data: {
          cpf: dados.cpf,
          nome: dados.nome.toUpperCase(),
          username: dados.username.toUpperCase(),
          telefone: dados.telefone,
          email: dados.email,
          construtora: dados.construtora,
          empreendimento: dados.empreendimento,
          Financeira: dados.Financeira,
          hierarquia: dados.hierarquia,
          password: dados.password,
          status: false,
          cargo: dados.cargo,
          password_key: this.generateHash(dados.password),
          reset_password: true, 
        },
      });
      return {
        error: false,
        message: 'Usuário cadastrado com sucesso',
        data: req
      }
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
      const req = await this.prismaService.nato_user.findMany({
        orderBy: {
          nome: 'asc',
        },
        select: {
          id: true,
          nome: true,
          cargo: true,
          hierarquia: true,
          empreendimento: true,
          construtora: true,
          Financeira: true,
          telefone: true,
          email: true,
          cpf: true,
          sms_relat: true,
          createdAt: true,
          status: true,
        },
      });

      const data = await Promise.all(
        req.map(async (data: any) => {


          const construtoraDb = await this.getUsersByConstrutora(data.construtora);

          const empreendimentoDb =
            await this.getUsersByEmpreendimento(data.empreendimento);

          const financeiraDb = await this.getUsersByFinanceira(data.Financeira);

          const Dados = {
            ...data,
            ...(financeiraDb &&{Financeira: financeiraDb}),
            ...(construtoraDb && {construtora: construtoraDb}),
            ...(empreendimentoDb && {empreendimento: empreendimentoDb}),
          };

          return Dados
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

  async search(empreedimento: string, financeiro: string, construtora: string, telefone: string, email: string, cpf: string, hierarquia: string) {
    try {
      return await this.prismaService.nato_user.findMany({
        where: {
          ...(empreedimento && { empreendimento: { contains: empreedimento } }),
          ...(financeiro && { Financeira: { contains: financeiro } }),
          ...(construtora && { construtora: { contains: construtora } }),
          ...(telefone && { telefone: { contains: telefone } }),
          ...(email && { email: { contains: email } }),
          ...(cpf && { cpf: { contains: cpf } }),
        },
      });
    } catch (error) {
      return error
    }
  }


  //-----------------------------------------------------------------------------------------------------

  async getUsersByEmpreendimento(EmpreendimentoId: string) {
    try {
      return await this.prismaService.nato_empreendimento.findMany({
        where: {
          id: {
            in: JSON.parse(EmpreendimentoId),
          },
        },
        select: {
          id: true,
          nome: true,
          uf: true,
          cidade: true,
        }
      })
    } catch (error) {
      return error
    }
  }

  async getUsersByConstrutora(construtora: string) {
    try {
      return await this.prismaService.nato_empresas.findMany({
        where: {
          id: {
            in: JSON.parse(construtora)
          }
        },
        select: {
          id: true,
          fantasia: true,
          cnpj: true,
          tel: true,
          email: true,
        }
      })
    } catch (error) {
      return error
    }
  }

  async getUsersByFinanceira(financeira: string) {
    try {
      return await this.prismaService.nato_financeiro.findMany({
        where: {
          id: {
            in: JSON.parse(financeira)
          },
        },
        select: {
          id: true,
          fantasia: true,
          cnpj: true,
          tel: true,
          email: true,
        }
      })
    } catch (error) {
      return error
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
        orderBy: {
          nome: 'asc',
        }
      })
    } catch (error) {
      return error
    }
  }

  async getCorretorByConstrutora(construtora: number) {
    try{
      return await this.prismaService.nato_user.findMany({
        where: {
          construtora: {
            contains: construtora.toString()
          }
        },
        select: {
          id: true,
          nome: true,
          cargo: true,
        }
      })
    }catch(error){
      return error
    }finally{
      this.prismaService.$disconnect
    }
  }

  async userTermo(id: number) {
    try{
      return await this.prismaService.nato_user.findUnique({
        where: {
          id: id,
      },
      select:{
          termos: true,
      }
      })
    }catch(error){
      return error
    }finally{
      this.prismaService.$disconnect
    }
}

  async updateTermo(id: number, data: any) {
    try{
      if(!data.termo){
        return {error: true,
          message: "Termo não Aceito",
          data:null
        }
      }
      const res = await this.prismaService.nato_user.update({
        where:{
          id: id
      },
      data:{
          termos: data.termo
      }
      })

      return {error: false,
        message: "Política de Privacidade e Termo de uso aceito",
        data: res
      }

    }catch(error){
      return error
    }finally{
      this.prismaService.$disconnect
    }
  }
}
