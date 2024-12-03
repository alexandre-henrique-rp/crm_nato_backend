import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';

export class ReadByIdChamadoDto {
  @ApiProperty({ description: 'ID do chamado', example: 1 })
  @IsNumber({}, { message: 'ID deve ser um número' })
  @Type(() => Number)
  id: number;

  @ApiProperty({ description: 'ID da solicitação associado ao chamado', example: 123 })
  @IsString({ message: 'Solicitação deve ser uma string válida' })
  @Type(() => String)
  solicitacao: number;

  @ApiProperty({ description: 'Descrição do chamado (assunto)', example: 'Chamado de teste' })
  @IsString({ message: 'Descrição deve ser uma string válida' })
  @Type(() => String)
  descricao: string;

  @ApiProperty({ description: 'Data de criação do chamado', example: '2023-05-01T00:00:00.000Z' })
  @IsDate({ message: 'Data deve ser uma data válida' })
  @Transform(({ value }) => new Date(value).toISOString())
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ description: 'Status do chamado, 0 = iniciado, 1 = em andamento, 2 = enviado para NL2, 3 = concluído, 4 = cancelado', example: 0 })
  @IsNumber({}, { message: 'Status deve ser um número' })
  @Type(() => Number)
  status: number;

  @ApiProperty({ description: 'Data de atualização do chamado', example: '2023-05-01T00:00:00.000Z' })
  @IsDate({ message: 'Data deve ser uma data válida' })
  @Transform(({ value }) => !!value && JSON.parse(value))
  updatedAt: Date;

  @ApiProperty({ description: 'Imagens do chamado', example: '["image1.jpg", "image2.jpg"]' })
  @IsArray({ message: 'images deve ser um array' })
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  images: string[];

  @ApiProperty({ description: 'Imagens do chamado', example: '["image1.jpg", "image2.jpg"]' })
  @IsArray({ message: 'images_adm deve ser um array' })
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  images_adm: string[];

  @ApiProperty({ description: 'id do usuário que abriu o chamado', example: 143 })
  @IsNumber({}, { message: 'id_user deve ser um número' })
  @Type(() => Number)
  idUser: number;
}
