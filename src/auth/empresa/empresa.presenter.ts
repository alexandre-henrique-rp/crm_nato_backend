import { nato_empresas } from '@prisma/client';

export class EmpresaPresenter {
  constructor(readonly empresa: nato_empresas) {}

  toJSON() {
    return {
      id: this.empresa.id,
      cnpj: this.empresa.cnpj,
      razaosocial: this.empresa.razaosocial,
      tel: this.empresa.tel,
      email: this.empresa.email,
      colaboradores: JSON.parse(this.empresa.colaboradores),
      responsavel: this.empresa.responsavel,
      tipo: this.empresa.tipo,
      createdAt: this.empresa.createdAt,
      updatedAt: this.empresa.updatedAt,
    };
  }
}
