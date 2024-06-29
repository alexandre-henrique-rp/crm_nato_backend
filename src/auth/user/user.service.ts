import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createUserDto } from './DTO/create_user.dto';
import * as bcrypt from 'bcrypt';

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

  generateHash(password: string) {
    return bcrypt.hashSync(password, 10);
  }
}
