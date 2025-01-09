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
import { FichaModule } from './ficha/ficha.module';
import { BugModule } from './bug/bug.module';
import { ChamadoModule } from './chamado/chamado.module';
import { ReFinanceiroModule } from './relatorio/financeiro/financeiro.module';
import { NowModule } from './now/now.module';
import { ChecktelModule } from './checktel/checktel.module';
import { ConstrutorasModule } from './construtoras/construtoras.module';
import { GetInfosModule } from './get-infos/get-infos.module';


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
    FichaModule,
    BugModule,
    ChamadoModule,
    ReFinanceiroModule,
    NowModule,
    ChecktelModule,
    ConstrutorasModule,
    GetInfosModule
  ],
  controllers: [UserController, AuthController, UserController2],
  providers: [UserService, AuthService],
})
export class AuthModule {}
