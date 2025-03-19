import { HttpException, Injectable } from '@nestjs/common';
import { CreateDiretoDto } from './dto/create-direto.dto';
import { UpdateDiretoDto } from './dto/update-direto.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ErrorClienteType } from './entities/error.cliente.entity';
import { plainToClass } from 'class-transformer';
import { ClienteDireto } from './entities/cliente.direto.entity';

@Injectable()
export class DiretoService {
    constructor(private prismaService: PrismaService) {}

  async findAll() {
    try {
      const request =
        await this.prismaService.nato_direto_solicitacoes.findMany({
          orderBy: {
            dt_solicitacao: 'desc',
          },
        });
      if (!request) {
        const retorno: ErrorClienteType = {
          message: 'Erro ao buscar Clientes',
        };
        throw new HttpException(retorno, 400);
      }

      return request.map((item) => plainToClass(ClienteDireto, item));
    } catch (error) {
      console.log(error);
      const retorno: ErrorClienteType = {
        message: error.message ? error.message : 'ERRO DESCONHECIDO',
      };
      throw new HttpException(retorno, 400);
    }finally{
       this.prismaService.$disconnect
    }
  }

  async findOne(id: number) {
    try {
      const request =
        await this.prismaService.nato_direto_solicitacoes.findUnique({
          where: {
            id: id,
          },
        });
      if (!request) {
        const retorno: ErrorClienteType = {
          message: 'Erro ao buscar Cliente',
        };
        throw new HttpException(retorno, 400);
      }
      return plainToClass(ClienteDireto, request);
    } catch (error) {
      console.log(error);
      const retorno: ErrorClienteType = {
        message: error.message ? error.message : 'ERRO DESCONHECIDO',
      };
      throw new HttpException(retorno, 400);
    }finally{
      this.prismaService.$disconnect
    }
  }

  async update(id: number, updateDiretoDto: UpdateDiretoDto) {
    try {
      const request = await this.prismaService.nato_direto_solicitacoes.update({
        where: {
          id: id,
        },
        data: updateDiretoDto,
      });
      if (!request) {
        const retorno: ErrorClienteType = {
          message: 'Erro ao atualizar Cliente',
        };
        throw new HttpException(retorno, 400);
      }
      return plainToClass(ClienteDireto, request);
    } catch (error) {
      console.log(error);
      const retorno: ErrorClienteType = {
        message: error.message ? error.message : 'ERRO DESCONHECIDO',
      };
      throw new HttpException(retorno, 400);
    }finally{
      this.prismaService.$disconnect
    }
  }

  async remove(id: number) {
    try{
      const request = await this.prismaService.nato_direto_solicitacoes.update({
        where: {
          id: id,
        },
        data: {
          ativo: false,
        },
      });
      if (!request) {
        const retorno: ErrorClienteType = {
          message: 'Erro ao desativar Cliente',
        };
        throw new HttpException(retorno, 400);
      }
      return plainToClass(ClienteDireto, request);
    }catch (error) {
      console.log(error);
      const retorno: ErrorClienteType = {
        message: error.message ? error.message : 'ERRO DESCONHECIDO',
      };
      throw new HttpException(retorno, 400);
    }finally{
      this.prismaService.$disconnect
    }
  }
}
