import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsEmail,
  IsOptional,
  IsDate,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSolicitacaoDto {
  @IsString({ message: 'Nome deve ser uma string válida' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome: string;

  @IsString({ message: 'Telefone deve ser uma string válida' })
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  telefone: string;

  @IsString({ message: 'CPF deve ser uma string válida' })
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  cpf: string;

  @IsString({ message: 'Telefone secundário deve ser uma string válida' })
  @IsOptional()
  telefone2?: string;

  @IsString({ message: 'Email deve ser uma string válida' })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString({ message: 'Upload de RG deve ser uma string válida' })
  @IsOptional()
  uploadRg?: string;

  @IsString({ message: 'Upload de CNH deve ser uma string válida' })
  @IsOptional()
  uploadCnh?: string;

  @IsNumber({}, { message: 'Corretor deve ser um número' })
  @IsPositive({ message: 'Corretor deve ser um número positivo' })
  @IsNotEmpty({ message: 'Corretor é obrigatório' })
  corretor: number;

  @IsNumber({}, { message: 'Construtora deve ser um número' })
  @IsPositive({ message: 'Construtora deve ser um número positivo' })
  @IsNotEmpty({ message: 'Construtora é obrigatória' })
  construtora: number;

  @IsNumber({}, { message: 'Empreendimento deve ser um número' })
  @IsPositive({ message: 'Empreendimento deve ser um número positivo' })
  @IsNotEmpty({ message: 'Empreendimento é obrigatório' })
  empreedimento: number;

  @IsDate({ message: 'Data de nascimento inválida' })
  @IsOptional()
  @Type(() => Date)
  dt_nascimento?: Date | string;

  @IsArray({ message: 'Relacionamento deve ser um array' })
  @IsOptional()
  relacionamento?: string[];

  @IsBoolean({ message: 'Rela quest deve ser um booleano' })
  @IsOptional()
  rela_quest?: boolean;

  @IsString({ message: 'Voucher deve ser uma string válida' })
  @IsOptional()
  voucher?: string;

  @IsNumber({}, { message: 'Financeiro deve ser um número' })
  @IsPositive({ message: 'Financeiro deve ser um número positivo' })
  @IsNotEmpty({ message: 'Financeiro é obrigatório' })
  financeiro: number;

  @IsNumber({}, { message: 'O id do usuário deve ser um número' })
  @IsPositive({ message: 'O id do usuário deve ser um número positivo' })
  @IsNotEmpty({ message: 'O id do usuário é obrigatório' })
  user: number;
}
