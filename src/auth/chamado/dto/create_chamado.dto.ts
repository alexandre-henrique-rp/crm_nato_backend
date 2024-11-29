import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
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
export class CreateChamadoDto {
  /**
   * ID da solicitação associado ao chamado.
   * - Deve ser um número positivo.
   * - Obrigatório.
   */
  @IsNumber({}, { message: 'solicitacao_id deve ser um número' })
  @IsPositive({ message: 'solicitacao_id deve ser um número positivo' })
  @IsNotEmpty({ message: 'solicitacao_id é obrigatório' })
  @Type(() => Number) // Garante que o valor seja transformado em número
  solicitacao_id: number;

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
   * - Deve ser um número positivo.
   * - Obrigatório.
   */
  @IsNumber({}, { message: 'status deve ser um número' })
  @IsPositive({ message: 'status deve ser um número positivo' })
  @IsNotEmpty({ message: 'status é obrigatório' })
  @Type(() => Number) // Garante que o valor seja transformado em número
  status: number;

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
}
