import { nato_empreendimento } from '@prisma/client';

export class EmpreendimentoPresenter {
  constructor(readonly empreendimento: nato_empreendimento) {}

  toJSON() {
    return {
      id: this.empreendimento.id,
      nome: this.empreendimento.nome,
      construtora: this.empreendimento.construtora,
      dt_inicio: this.empreendimento.dt_inicio,
      dt_fim: this.empreendimento.dt_fim,
      uf: this.empreendimento.uf,
      cidade: this.empreendimento.cidade,
      chave: this.empreendimento.chave,
      vendedores: JSON.parse(this.empreendimento.vendedores),
      ativo: this.empreendimento.ativo,
      createdAt: this.empreendimento.createdAt,
      updatedAt: this.empreendimento.updatedAt,
    };
  }
}
