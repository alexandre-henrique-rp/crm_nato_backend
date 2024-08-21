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
      tipo: this.empresa.tipo,
      fantasia: this.empresa.fantasia,
      createdAt: this.empresa.createdAt,
      updatedAt: this.empresa.updatedAt,
    };
  }
}
