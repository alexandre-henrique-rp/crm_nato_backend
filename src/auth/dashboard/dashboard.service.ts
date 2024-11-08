import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prismaService: PrismaService) { }

  async getDashboard() {
    try {
      const DataInicio = new Date();
      const DataFim = new Date();
      const Status = true;
      const StatusPG = true;

      const data = {} 
      return data;
    } catch (error) {
      console.error('Erro ao buscar empreendimentos:', error);
      throw new Error('Erro ao buscar empreendimentos. Por favor, tente novamente mais tarde.');
    }
  }

  async GetSolicitacoes(DataInicio: Date, DataFim: Date) {
    try {
      const resq = await this.prismaService.nato_solicitacoes_certificado.findMany({
        where: {
          dt_solicitacao: {
            gte: new Date(DataInicio).toISOString(),
            lte: new Date(DataFim).toISOString(),
          },
        },
      })
      

    } catch (error) {
      console.error('Erro ao buscar as solicitações:', error);
      throw new Error('Erro ao buscar as solicitações. Por favor, tente novamente mais tarde.');
    }finally{
      this.prismaService.$disconnect
    }
  }

  async GetEmpreendimentos(DataId: number) {
    try {
      const req = await this.prismaService.nato_empreendimento.findMany({
        where: {
          id: DataId
        },
        select: {
          id: true,
          nome: true,
        }
      })
      return req
    } catch (error) {
      console.error('Erro ao buscar o empreendimento:', error);
      throw new Error('Erro ao buscar o empreendimento. Por favor, tente novamente mais tarde.');
    }finally{
      this.prismaService.$disconnect
    }
  }

  async GetContratados(DataId: number) {
    try {
      const req = await this.prismaService.nato_empresas.findMany({
        where: {
          id: DataId
        },
        select: {
          id: true,
          fantasia: true,
        }
      })
      return req
    } catch (error) {
      console.error('Erro ao buscar a construtora:', error);
      throw new Error('Erro ao buscar a construtora. Por favor, tente novamente mais tarde.');
    }finally{
      this.prismaService.$disconnect
    }
  }

  async GetVendedores(DataId: number) {
    try {
      const req = await this.prismaService.nato_user.findMany({
        where: {
          id: DataId
        },
        select: {
          id: true,
          nome: true,
        }
      })
      return req
    } catch (error) {
      console.error('Erro ao buscar o vendedor:', error);
      throw new Error('Erro ao buscar o vendedor. Por favor, tente novamente mais tarde.');
    }finally{
      this.prismaService.$disconnect
    }
  }

  async GetFinanceiras(DataId: number) {
    try {
      const req = await this.prismaService.nato_financeiro.findMany({
        where: {
          id: DataId
        },
        select: {
          id: true,
          fantasia: true,
        }
      })
      return req
    } catch (error) {
      console.error('Erro ao buscar o financeiro:', error);
      throw new Error('Erro ao buscar o financeiro. Por favor, tente novamente mais tarde.');
    }finally{
      this.prismaService.$disconnect
    }
  } 

  async GetFCW(DataId: number) {
    try {
      const req = await this.prismaService.fcweb.findMany({
        where: {
          id: DataId
        },
        select: {
          id: true,
          valorcd: true,
          estatos_pgto: true,
          validacao: true,
          dt_aprovacao: true,
        }
      })
      return req
    } catch (error) {
      console.error('Erro ao buscar a Ficha de Contrato:', error);
      throw new Error('Erro ao buscar a Ficha de Contrato. Por favor, tente novamente mais tarde.');
    }finally{
      this.prismaService.$disconnect
    }
  }
}
