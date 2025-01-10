import { nato_user } from '@prisma/client';

export class UserPresenter {
  constructor(readonly user: nato_user) {}

  toJSON() {
    return {
      id: this.user.id,
      username: this.user.username,
      email: this.user.email,
      telefone: this.user.telefone,
      cpf: this.user.cpf,
      nome: this.user.nome,
      construtora: JSON.parse(this.user.construtora),
      empreendimento: JSON.parse(this.user.empreendimento),
      hierarquia: this.user.hierarquia,
      Financeira: JSON.parse(this.user.Financeira),
      cargo: this.user.cargo,
      createdAt: this.user.createdAt,
      updatedAt: this.user.updatedAt,
      status: this.user.status,
      reset_password: this.user.reset_password,
    };
  }
}
