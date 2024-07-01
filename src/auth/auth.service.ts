import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from './user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userservice: UserService,
    private jwtService: JwtService,
  ) {}

  async Login(data: LoginDto) {
    const user = await this.userservice.findOne(data.username);
    if (!user) {
      throw new Error('Usuário e senha incorretos');
    }
    const isValid = bcrypt.compareSync(data.password, user.password_key);
    if (!isValid) {
      throw new Error('Usuário e senha incorretos');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_key, password, ...datauser } = user;
    const result = {
      token: this.jwtService.sign(datauser),
      user: {
        id: user.id,
        username: user.username,
        nome: user.nome,
        cpf: user.cpf,
        telefone: user.telefone,
        email: user.email,
        construtora: JSON.parse(user.construtora),
        empreendimento: JSON.parse(user.empreendimento),
        hierarquia: JSON.parse(user.hierarquia),
        cargo: user.cargo,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
    return result;
  }
}
