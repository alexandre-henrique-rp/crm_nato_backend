import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateConstrutoraDto {
  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @IsString()
  @IsNotEmpty()
  razaosocial: string;

  @IsString()
  @IsNotEmpty()  
  fantasia: string;

  @IsString()
  @IsNotEmpty()
  tel: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  financeiro: string

  @IsString()
  @IsNotEmpty()
  atividade: string
}
