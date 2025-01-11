import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsPositive, MaxLength, MinLength } from "class-validator";

export class CreateEmpreendimentoDto {
  @ApiProperty({ description: 'ID da construtora', example: 1 })
  @IsNotEmpty({ message: 'A Construtora é obrigatória ' })
  @IsPositive({ message: 'Construtora Inválida ' })
  construtora: number;

  @ApiProperty({description: 'Estado-UF', example: 'SP'})
  @IsNotEmpty({ message: 'UF é obrigatória ' })
  @MaxLength(2, { message: 'UF inválida ' })
  uf: string;

  @ApiProperty({description: 'Cidade', example: 'São Paulo'})
  @IsNotEmpty({ message: 'Cidade é obrigatória ' })
  @MinLength(3, { message: 'Cidade inválida ' })
  cidade: string;

  @ApiProperty({description: 'Ativo', example: true})
  @IsNotEmpty({ message: 'ERRO Interno ' })
  @IsBoolean({ message: 'Ativo deve ser true ou false ' })
  ativo: boolean

  @ApiPropertyOptional({description: 'Nome', example: 'TAG - Nome do empreendimento'})
  @IsOptional()
  nome: string

  @ApiPropertyOptional({description: 'Data de inicio', example: '2023-01-01'})
  @IsOptional()
  dt_inicio: string

  @ApiPropertyOptional({description: 'Financeiro', example: '[1,2,3,4]'})
  @IsOptional()
  financeiro: string

  @ApiPropertyOptional({description: 'Vendedores', example: '[1,2,3,4]'})
  @IsOptional()
  vendedores: string

  @ApiPropertyOptional({description: 'Tags', example: 'TAG_'})
  @IsOptional()
  tag: string

}