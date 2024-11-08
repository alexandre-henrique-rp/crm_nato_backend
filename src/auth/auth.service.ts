import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async Login(data: LoginDto) {
    try {
      const user = await this.userLoginRequest(data.username);

      if (!user) {
        // throw new Error('Usuário e senha incorretos');
        return { error: true, mesage: 'Usuário e senha incorretos3' };
      }
      const isValid = bcrypt.compareSync(data.password, user.password_key);

      if (!isValid) {
        // throw new Error('Usuário e senha incorretos');
        return { error: true, mesage: 'Usuário e senha incorretos2' };
      }

      if (!user.status) {
        // throw new Error('Usuário inativo, contate o administrador');
        return {
          error: true,
          mesage: 'Usuário inativo, contate o administrador1',
        };
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_key, password, ...datauser } = user;
      const Pyload = {
        id: user.id,
        nome: user.nome,
        construtora: user.construtora.map((x: any) => x.id),
        empreendimento: user.empreendimento.map((x: any) =>  x.id),
        hierarquia: user.hierarquia,
        Financeira: user.Financeira.map((x: any) => x.id),
      }
      const result = {
        token: this.jwtService.sign(Pyload),
        user: {
          id: user.id,
          nome: user.nome,
          telefone: user.telefone,
          construtora: user.construtora,
          empreendimento: user.empreendimento,
          hierarquia: user.hierarquia,
          cargo: user.cargo,
          status: user.status,
          Financeira: user.Financeira,
          reset_password: user.reset_password,
          termos: user.termos
        },
      };
      
      return result;
    } catch (error) {
     
      throw error;
    }
  }

  async userLoginRequest(username: string) {
    try {
      const request = await this.prismaService.nato_user.findFirst({
        where: {
          username,
        },
      });

      if (!request) {
        return null;
      }

      const construtora = request.construtora.length > 0 ? await Promise.all(
        JSON.parse(request.construtora).map(async (item: number) =>
          this.getConstrutora(Number(item)),
        ),
      ): [];

      const empreendimento = request.empreendimento.length > 0 ? await Promise.all(
        JSON.parse(request.empreendimento).map(async (item: number) =>
          this.getEmpreedimento(Number(item)),
        ),
      ): [];

      const Financeira = request.Financeira.length > 0 ?await Promise.all(
         JSON.parse(request.Financeira).map(async (item: number) =>
          this.getFinanceira(Number(item)),
        ) 
      ) : []

      const data = {
        ...request,
        construtora,
        empreendimento,
        Financeira,
      };

      return data;
    } catch (error) {
      return error;
    }finally{
      this.prismaService.$disconnect
    }
  }

  async getEmpreedimento(id: number) {
    try {
      return await this.prismaService.nato_empreendimento.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          nome: true
        },
        orderBy: {
          nome: 'asc'
        }
      });
    } catch (error) {
      return {};
    }finally{
      this.prismaService.$disconnect
    }
  }

  async getConstrutora(id: number) {
    try {
      return await this.prismaService.nato_empresas.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          fantasia: true,
        },
        orderBy: {
          fantasia: 'asc'
        }
      });
    } catch (error) {
      return {};
    }finally{
      this.prismaService.$disconnect
    }
  }

  async getFinanceira(id: number) {
    try {
      return await this.prismaService.nato_financeiro.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          fantasia: true
        },
        orderBy: {
          fantasia: 'asc'
        }
      });
    } catch (error) {
      return {};
    }finally{
      this.prismaService.$disconnect
    }
  }
}
