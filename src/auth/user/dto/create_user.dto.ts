import { IsEmail, IsNotEmpty, IsString, IsArray, ArrayMinSize, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string válida' })
  nome: string;

  @IsNotEmpty({ message: 'Nome de usuário é obrigatório' })
  @IsString({ message: 'Nome de usuário deve ser uma string válida' })
  username: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString({ message: 'Senha deve ser uma string válida' })
  @Transform(({ value }) => value?.trim())
  password: string;

  @IsOptional()
  @IsString({ message: 'Telefone deve ser uma string válida' })
  @Transform(({ value }) => value?.trim())
  telefone?: string;

  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email inválido' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @IsOptional()
  @IsString({ message: 'CPF deve ser uma string válida' })
  @Transform(({ value }) => value?.replace(/\D/g, ''))
  cpf?: string;

  @IsNotEmpty({ message: 'Cargo é obrigatório' })
  @IsString({ message: 'Selecionar um cargo' })
  cargo: string;

  @IsOptional()
  @IsArray({ message: 'Construtora deve ser um array de strings' })
  @IsString({ each: true, message: 'Selecionar pelo menos uma construtora' })
  @ArrayMinSize(1, { message: 'Deve haver pelo menos uma construtora' })
  construtora?: string[];

  @IsOptional()
  @IsArray({ message: 'Empreendimento deve ser um array de strings' })
  @IsString({ each: true, message: 'Selecionar pelo menos um empreendimento' })
  @ArrayMinSize(1, { message: 'Deve haver pelo menos um empreendimento' })
  empreendimento?: string[];

  @IsOptional()
  @IsString({ message: 'Selecionar uma hierarquia' })
  hierarquia?: string;

  @IsOptional()
  @IsArray({ message: 'Financeira deve ser um array de strings' })
  @IsString({ each: true, message: 'Selecionar pelo menos um item financeiro' })
  @ArrayMinSize(1, { message: 'Deve haver pelo menos um item financeiro' })
  financeira?: string[];
}