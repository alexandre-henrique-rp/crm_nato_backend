import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';

/**
 * DTO para criar um chamado.
 * Valida e transforma os dados recebidos na requisição.
 */
export class UpdateChamadoDto {
  /**
   * ID da solicitação associado ao chamado.
   * - Deve ser um número positivo.
   * - Obrigatório.
   */
  @IsNumber({}, { message: 'solicitacao_id deve ser um número' })
  @IsPositive({ message: 'solicitacao_id deve ser um número positivo' })
  @IsNotEmpty({ message: 'solicitacao_id é obrigatório' })
  @Type(() => Number) // Garante que o valor seja transformado em número
  solicitacao: number;

  /**
   * Descrição do chamado (assunto).
   * - Deve ser uma string.
   * - Obrigatório.
   */
  @IsString({ message: 'Descrição deve ser uma string válida' })
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  descricao: string;

  /**
   * Status do chamado.
   *
   * - Deve ser um número positivo.
   * - Deve ser 0, 1, 2 ou 3.
   */
  @IsNumber({}, { message: 'status deve ser um número' })
  @IsIn([0, 1, 2, 3], { message: 'O status deve ser 0, 1, 2 ou 3.' })
  @Type(() => Number)
  status: number;

  /**
   * id do usuário que abriu o chamado.
   *
   * - Deve ser um número positivo.
   * - Obrigatório.
   */
  @IsNumber({}, { message: 'status deve ser um número' })
  @IsPositive({ message: 'status deve ser um número positivo' })
  @IsNotEmpty({ message: 'status é obrigatório' })
  idUser: number;

  /**
   * Lista de imagens associadas ao chamado.
   * - Deve ser um array de strings.
   * - Se fornecido, o array será transformado em uma única string no formato JSON.
   * - Opcional.
   */
  @IsOptional() // Campo não é obrigatório
  @ValidateIf((obj) => Array.isArray(obj.images)) // Valida apenas se o valor for um array
  @IsArray({ message: 'images deve ser um array' }) // Garante que seja um array
  @ArrayNotEmpty({ message: 'images não pode ser um array vazio' }) // Garante que o array não esteja vazio
  @IsString({ each: true, message: 'Cada item em images deve ser uma string' }) // Valida que todos os itens sejam strings
  @Transform(({ value }) => {
    // Transforma o array em uma string no formato JSON, se aplicável
    if (Array.isArray(value)) {
      return JSON.stringify(value);
    }
    return value;
  })
  images?: string; // Após a transformação, será uma string

  /**
   * Lista de imagens associadas ao chamado.
   * - Deve ser um array de strings.
   * - Se fornecido, o array será transformado em uma única string no formato JSON.
   * - Opcional.
   */
  @IsOptional() // Campo não é obrigatório
  @ValidateIf((obj) => Array.isArray(obj.images)) // Valida apenas se o valor for um array
  @IsArray({ message: 'images_adm deve ser um array' }) // Garante que seja um array
  @ArrayNotEmpty({ message: 'images_adm não pode ser um array vazio' }) // Garante que o array não esteja vazio
  @IsString({
    each: true,
    message: 'Cada item em images_adm deve ser uma string',
  }) // Valida que todos os itens sejam strings
  @Transform(({ value }) => {
    // Transforma o array em uma string no formato JSON, se aplicável
    if (Array.isArray(value)) {
      return JSON.stringify(value);
    }
    return value;
  })
  images_adm?: string;

  /**
   * resposta do chamado.
   * - Deve ser uma string.
   * - Obrigatório.
   */
  @IsString({ message: 'Resposta deve ser uma string válida' })
  @IsNotEmpty({ message: 'Resposta é obrigatória' })
  resposta: string;
}
