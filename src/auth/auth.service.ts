import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from './user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtservice: JwtService,
  ) {}

  async login(dados: LoginDto) {
    try {
      const user = await this.userService.findOne(dados.username);
      if (!user || !(await bcrypt.compare(dados.password, user.password_key))) {
        throw new Error('Usuário ou senha inválidos');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_key, password, ...results } = user;

      return {
        acess_token: this.jwtservice.sign(results),
      };
    } catch (error) {
      throw error;
    }
  }

  // gerar hash
  generateHash(password: string) {
    return bcrypt.hashSync(password, 10);
  }
}
