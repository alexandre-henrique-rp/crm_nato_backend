import { nato_solicitacoes_certificado } from '@prisma/client';

export class SolicitacaoPresenter {
  constructor(readonly solicitacao: nato_solicitacoes_certificado) {}

  toJSON() {
    return {
      id: this.solicitacao.id,
      nome: this.solicitacao.nome,
      cpf: this.solicitacao.cpf,
      email: this.solicitacao.email,
      dt_solicitacao: this.solicitacao.dt_solicitacao,
      corretor: this.solicitacao.corretor,
      construtora: this.solicitacao.construtora,
      telefone: this.solicitacao.telefone,
      telefone2: this.solicitacao.telefone2,
      dt_nascimento: this.solicitacao.dt_nascimento,
      ass_doc: this.solicitacao.ass_doc,
      link_doc: this.solicitacao.link_doc,
      id_fcw: this.solicitacao.id_fcw,
      obs: this.solicitacao.obs,
      alert: this.solicitacao.alert,
      empreedimento: this.solicitacao.empreedimento,
      cnh: this.solicitacao.cnh,
      uploadCnh: this.solicitacao.uploadCnh,
      uploadRg: this.solicitacao.uploadRg,
      rela_quest: this.solicitacao.rela_quest,
      voucher: this.solicitacao.voucher,
      link_planilha: this.solicitacao.link_planilha,
      ativo: this.solicitacao.ativo,
      relacionamento: JSON.parse(this.solicitacao.relacionamento),
      createdAt: this.solicitacao.createdAt,
      updatedAt: this.solicitacao.updatedAt,
    };
  }
}
