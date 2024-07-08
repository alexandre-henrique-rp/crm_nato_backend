import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { createUserDto } from './dto/create_user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  create(dados: createUserDto) {
    try {
      return this.prismaService.nato_user.create({
        data: {
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

  findAll() {
    try {
      return this.prismaService.nato_user.findMany();
    } catch (error) {
      throw error;
    }
  }

  update(id: number, data: any) {
    try {
      return this.prismaService.nato_user.update({
        where: {
          id,
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
          id,
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

  findByid(username: string) {
    try {
      return this.prismaService.nato_user.findFirst({
        where: {
          username,
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
}
