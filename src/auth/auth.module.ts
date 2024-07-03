import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { SolicitacaoModule } from './solicitacao/solicitacao.module';
import { EmpresaModule } from './empresa/empresa.module';
import { EmpreendimentoModule } from './empreendimento/empreendimento.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '4h' },
      global: true,
    }),
    SolicitacaoModule,
    EmpresaModule,
    EmpreendimentoModule,
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, AuthService],
})
export class AuthModule {}
