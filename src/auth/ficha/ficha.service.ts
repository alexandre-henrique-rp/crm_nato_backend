import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FichaService {
  constructor(private prismaService: PrismaService) { }

  async CreateFicha(data: any) {
    try {
      console.log(data)
      const req = await this.prismaService.fcweb.create({ data: { ...data, pgto_efi: '', im: 0 } })
      return req
    } catch (error) {
      console.log("🚀 ~ FichaService ~ CreateFicha ~ error:", error)
      return error
    }
  }

  async GetUpdate(id: number, user: any) {
    try {
      // Verificar se o id existe
      if (id === null || id === undefined) {
        throw new Error("Id não pode ser nulo ou indefinido");
      }

      // Verificar se o usuário existe
      if (user === null || user === undefined) {
        throw new Error("Usuário não pode ser nulo ou indefinido");
      }

      // Verificar se o id da solicitação existe
      const solicitacao = await this.prismaService.nato_solicitacoes_certificado.findFirst({
        where: {
          id: id
        }
      });

      if (!solicitacao) {
        throw new Error(`A solicitação com id ${id} não existe`);
      }

      // Verificar se o empreendimento existe
      const empreedimento = await this.GetEmpreedimento(solicitacao.empreedimento);

      if (!empreedimento) {
        throw new Error(`O empreendimento com id ${solicitacao.empreedimento} não existe`);
      }

      // Verificar se o corretor existe
      const corretor = await this.GetCorretor(solicitacao.corretor);

      if (!corretor) {
        throw new Error(`O corretor com id ${solicitacao.corretor} não existe`);
      }

      const DataAtual = new Date();
      DataAtual.setHours(DataAtual.getHours() - 3);

      const dataFcweb = {
        cpf: solicitacao.cpf.replace(/\W+/g, ""),
        nome: solicitacao.nome.toUpperCase(),
        telefone: solicitacao.telefone.replace(/\W+/g, ""),
        telefone2: solicitacao.telefone2.replace(/\W+/g, ""),
        email: solicitacao.email.replace(/\s+/g, "").toLowerCase(),
        dtnascimento: solicitacao.dt_nascimento.toISOString().split("T")[0],
        cidade: empreedimento.cidade,
        uf: empreedimento.uf,
        andamento: "NOVA FC",
        unidade: "1",
        s_alerta: "ATIVADO",
        referencia: `${DataAtual.toLocaleDateString('pt-BR')} ${DataAtual.toLocaleTimeString('pt-BR')}`,
        obscont: `Criado Por: ${user?.nome} - Empreendimento: ${empreedimento.nome} - vendedor: ${corretor.nome} - ( ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')} )`,
        tipocd: "A3PF Bird5000",
        valorcd: "100,00",
        criou_fc: 'API',
        historico: `${solicitacao.logDelete}${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}-${user?.nome}:Criou a FC através do sisnato.\n`,
        contador: "NATO_",
      };

      // Correção: apenas aguarde a promessa retornada por CreateFicha
      const fcweb = await this.CreateFicha(dataFcweb);
      console.log("🚀 ~ FichaService ~ GetUpdate ~ fcweb:", fcweb);

      const DataUpdate = {
        id_fcw: fcweb.id,
        logDelete: `${solicitacao.logDelete}\nO usuário: ${user?.nome}, id: ${user?.id} Criou fcweb em: ${new Date().toLocaleDateString('pt-BR')} as ${new Date().toLocaleTimeString('pt-BR')}`,
        Andamento: "INICIADO",
      };

      const req = await this.prismaService.nato_solicitacoes_certificado.update({
        where: {
          id: id
        },
        data: DataUpdate
      });
      console.log("🚀 ~ FichaService ~ GetUpdate ~ req:", req);

      return req;
    } catch (error) {
      console.log("🚀 ~ FichaService ~ GetUpdate ~ error:", error);
      return error;
    }
  }

  //_______________________________________________________________

  /**
   * Retorna o empreendimento de uma solicita o.
   *
   * @param id ID da solicita o.
   * @returns O empreendimento da solicita o.
   * {id: number, nome: 'string, cidade: 'string', uf: 'string', tag: 'string'}
   */
  async GetEmpreedimento(id: number) {
    try {
      // Verificar se o id existe
      if (id === null || id === undefined) {
        throw new Error("Id n o pode ser nulo ou indefinido");
      }

      const req = await this.prismaService.nato_empreendimento.findFirst({
        where: {
          id: id,
        },
        select: {
          id: true,
          nome: true,
          cidade: true,
          uf: true,
          tag: true,
        },
      });
      return req;
    } catch (error) {
      return error;
    }
  }

  /**
   * Retorna a construtora de uma solicita o.
   *
   * @param id ID da solicita o.
   * @returns A construtora da solicita o.
   * {id: number, fantasia: string}
   */
  async GetConstrutora(id: number) {
    try {
      const req = await this.prismaService.nato_empresas.findFirst({
        where: {
          id: id,
        },
        select: {
          id: true,
          fantasia: true,
        },
      });
      return req;
    } catch (error) {
      return error;
    }
  }

  /**
   * Retorna o corretor de uma solicita o.
   *
   * @param id ID da solicita o.
   * @returns O corretor da solicita o.
   * {id: number, nome: string, telefone: string}
   */
  async GetCorretor(id: number) {
    try {
      const req = await this.prismaService.nato_user.findFirst({
        where: {
          id: id,
        },
        select: {
          id: true,
          nome: true,
          telefone: true,
        },
      });
      return req;
    } catch (error) {
      return error;
    }
  }

  /**
   * Retorna a financeira de uma solicita o.
   *
   * @param id ID da solicita o.
   * @returns A financeira da solicita o.
   * {id: number, fantasia: string}
   */
  async getFinanceiro(id: number) {
    try {
      return await this.prismaService.nato_financeiro.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          fantasia: true,
        }
      });
    } catch (error) {
      return {};
    }
  }
}
