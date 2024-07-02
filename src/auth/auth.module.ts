import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { SolicitacaoModule } from './solicitacao/solicitacao.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '4h' },
      global: true,
    }),
    SolicitacaoModule,
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, AuthService],
})
export class AuthModule {}
