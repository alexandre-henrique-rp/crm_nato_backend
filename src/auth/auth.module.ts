import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { SolicitacaoModule } from './solicitacao/solicitacao.module';
import { EmpresaModule } from './empresa/empresa.module';
import { EmpreendimentoModule } from './empreendimento/empreendimento.module';
import { UserController2 } from './user/create/user.controller';
import { AlertsModule } from './alerts/alerts.module';
import { FinanceiroModule } from './financeiro/financeiro.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { FileModule } from './file/file.module';

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
    AlertsModule,
    FinanceiroModule,
    DashboardModule,
    FileModule,
  ],
  controllers: [UserController, AuthController, UserController2],
  providers: [UserService, AuthService],
})
export class AuthModule {}
