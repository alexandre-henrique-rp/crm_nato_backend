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
          username: dados.username,
          password: dados.password,
          password_key: this.generateHash(dados.password),
          email: dados.email,
          telefone: dados.telefone,
          cpf: dados.cpf,
          nome: dados.nome,
          construtora: JSON.stringify(dados.construtora),
          empreendimento: JSON.stringify(dados.empreendimento),
          hierarquia: JSON.stringify(dados.hierarquia),
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

  // pesquisar um usuario
  findOne(IdOfUser: number | string) {
    try {
      return this.prismaService.nato_user.findFirst({
        where: {
          ...(typeof IdOfUser === 'number'
            ? { id: IdOfUser }
            : { username: IdOfUser }),
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
