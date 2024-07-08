import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post()
  async Login(@Body() data: LoginDto) {
    try {
      const req = await this.authService.Login(data);
      return req;
    } catch (error) {
      return error;
    }
  }
}
