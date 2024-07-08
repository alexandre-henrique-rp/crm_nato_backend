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
        throw new Error('Usuário e senha incorretos');
      }
      const isValid = bcrypt.compareSync(data.password, user.password_key);

      if (!isValid) {
        throw new Error('Usuário e senha incorretos');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_key, password, ...datauser } = user;
      const result = {
        token: this.jwtService.sign(datauser),
        expire: new Date().getTime() + 14400000, //expirar em 4 h em segundos
        user: {
          id: user.id,
          username: user.username,
          nome: user.nome,
          cpf: user.cpf,
          telefone: user.telefone,
          email: user.email,
          construtora: user.construtora,
          empreendimento: user.empreendimento,
          hierarquia: user.hierarquia,
          cargo: user.cargo,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
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

      const construtora = await Promise.all(
        JSON.parse(request.construtora).map(async (item: number) =>
          this.getConstrutora(Number(item)),
        ),
      );

      const empreendimento = await Promise.all(
        JSON.parse(request.empreendimento).map(async (item: number) =>
          this.getEmpreedimento(Number(item)),
        ),
      );

      const data = {
        ...request,
        construtora,
        empreendimento,
      };

      return data;
    } catch (error) {
      return error;
    }
  }

  async getEmpreedimento(id: number) {
    try {
      return await this.prismaService.nato_empreendimento.findFirst({
        where: {
          id,
        },
      });
    } catch (error) {
      return {};
    }
  }

  async getConstrutora(id: number) {
    try {
      return await this.prismaService.nato_empresas.findFirst({
        where: {
          id,
        },
      });
    } catch (error) {
      return {};
    }
  }
}
