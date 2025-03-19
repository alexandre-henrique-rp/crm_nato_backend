import { IsOptional, IsString } from 'class-validator';

export class UpdateDiretoDto {

  @IsOptional()
  @IsString({
    message: 'nome deve ser uma string',
  })
  nome?: string;

  @IsOptional()
  @IsString({
    message: 'telefone deve ser uma string',
  })
  telefone?: string;

  @IsOptional()
  @IsString({
    message: 'email deve ser uma string',
  })
  email?: string;

  @IsOptional()
  @IsString({
    message: 'dt_nascimento deve ser uma string',
  })
  dt_nascimento?: string;

  @IsOptional()
  @IsString({
    message: 'status_pgto deve ser uma string',
  })
  status_pgto?: string;
}
