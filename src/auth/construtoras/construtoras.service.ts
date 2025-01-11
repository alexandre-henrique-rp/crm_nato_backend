import { Injectable } from '@nestjs/common';
import { CreateConstrutoraDto } from './dto/create-construtora.dto';
import { UpdateConstrutoraDto } from './dto/update-construtora.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { error } from 'console';
import { where } from 'sequelize';

@Injectable()
export class ConstrutorasService {
  constructor(private prismaService: PrismaService) {}
  async create(createConstrutoraDto: CreateConstrutoraDto) {
    try{
      const exist = await this.prismaService.nato_empresas.findFirst({
        where:{
          cnpj: createConstrutoraDto.cnpj
        }
      })
      if (exist){
        return {error: true,
          message:
            "CNPJ ja cadastrado para outra empresa",}
      }
      return await this.prismaService.nato_empresas.create({
      data: createConstrutoraDto,
    })
  }
  catch (error) {
    return error
  }finally{
    this.prismaService.$disconnect
  }
  }

  findAll() {
    try{
      return this.prismaService.nato_empresas.findMany({
        where:{
                      id: { not: 1 },
         },
      })
    }catch (error) {
      return error
    }finally{
      this.prismaService.$disconnect
    }
  }

  findOne(id: number) {
    try{
      return this.prismaService.nato_empresas.findUnique({
        where:{
          id
        }
    })
    }catch (error) {
      return error
    }finally{
      this.prismaService.$disconnect
    }
  }

  update(id: number, updateConstrutoraDto: UpdateConstrutoraDto) {
    try{
      return this.prismaService.nato_empresas.update({
        where:{
          id: id
        },
        data: updateConstrutoraDto
      })
        }catch (error) {
          return error
        }finally{
          this.prismaService.$disconnect
        }
    }


 async remove(id: number) {
    try{
      const referencias = await this.prismaService.nato_empreendimento.findMany({
        where: {
          construtora: id
        }
      })

      if(referencias.length > 0 ){
        return {error: true,
          message:
            "Existem Empreendimentos cadastrados para essa empresa referências na tabela ",}
      }else{
        return this.prismaService.nato_empresas.delete({
          where:{
            id: id
          }
        })
      }
    }catch (error) {
      return error
    }finally{
      this.prismaService.$disconnect
    }
  }
}
