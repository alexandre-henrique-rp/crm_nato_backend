import { Injectable } from '@nestjs/common';
import { CreateSuporteDto } from './dto/create-suporte.dto';
import { UpdateSuporteDto } from './dto/update-suporte.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SuporteService {
  constructor( private prismaService: PrismaService) {}
  async create(createSuporteDto: CreateSuporteDto) {
    try{
      return await this.prismaService.nato_suporte.create({
        data: createSuporteDto,
      })

    }catch(error){
      return error
    }finally{
      this.prismaService.$disconnect
    }
  }

  async findAllById(id: number) {
    try{
      const suporte = await this.prismaService.nato_suporte.findMany({
        where: {
          solicitacao: id,
        },
      });    
      return suporte.map((i) => {
        return{
          ...i,
          ...(i.urlSuporte &&{urlSuporte : JSON.parse(i.urlSuporte)})
      }
      });
    }catch(error){
      return error
    }finally{
      this.prismaService.$disconnect
    }
  }

  async findOne(id: number) {
    try{
      const suporte = await this.prismaService.nato_suporte.findUnique({
        where: {
          id: id,
        },
      })
      if(suporte){
        return{
          ...suporte,
          ...(suporte.urlSuporte &&{urlSuporte : JSON.parse(suporte.urlSuporte)})
        }
      }
      return null
    }catch(error){
      return error
    }finally{
      this.prismaService.$disconnect
    }
  }

  async update(id: number, updateSuporteDto: UpdateSuporteDto) {
    try{
      const imgSalvas = await this.prismaService.nato_suporte.findUnique({
        where: {
          id: id,
        },
        select: {
          urlSuporte: true
        }
      })
      if(imgSalvas && imgSalvas.urlSuporte){
        const urlSuporteSalvas = JSON.parse(imgSalvas.urlSuporte)
       updateSuporteDto.urlSuporte = updateSuporteDto.urlSuporte.concat(urlSuporteSalvas)
      }

        const req = await this.prismaService.nato_suporte.update({
          where: {
            id: id,
          },
          data: {
              tag: updateSuporteDto.tag,
              deescricao: updateSuporteDto.deescricao,
              urlSuporte: JSON.stringify(updateSuporteDto.urlSuporte),
          },
        })
        return req
    }catch(error){
      return error
    }finally{
      this.prismaService.$disconnect
    }
    
  }

  async remove(id: number) {
    try{
      return await this.prismaService.nato_suporte.delete({
        where:{
          id: id
        }
      })
    }catch(error){
      return error
    }finally{
      this.prismaService.$disconnect
    }
  }

  async deleteImg(id: number, index: number){ {
    try{
      const suporte = await this.prismaService.nato_suporte.findUnique({
        where: {
                      id: id,
                  },
                  select: {
                      urlSuporte: true
                  }
      })
      if(suporte && suporte.urlSuporte){
        const urlSuporte = JSON.parse(suporte.urlSuporte)
        urlSuporte.splice(index, 1)

        await this.prismaService.nato_suporte.update({
            where: {
                id: id,
            },
            data: {
                urlSuporte: JSON.stringify(urlSuporte),
            }
        });
    }
    return suporte
    }catch(error){
      return error
    }finally{
      this.prismaService.$disconnect
    }
    }
  }
}
