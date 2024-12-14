import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @IsOptional()
  @ApiPropertyOptional({ description: 'ID da solicitação associado ao chamado', example: 123 })
  @IsNumber({}, { message: 'solicitacao_id deve ser um número' })
  @IsPositive({ message: 'solicitacao_id deve ser um número positivo' })
  @Type(() => Number) // Garante que o valor seja transformado em número
  solicitacao?: number;

  /**
   * Descrição do chamado (assunto).
   * - Deve ser uma string.
   * - Obrigatório.
   */
  @IsOptional()
  @ApiPropertyOptional({ description: 'Descrição do chamado (assunto)', example: 'Chamado de teste' })
  @IsString({ message: 'Descrição deve ser uma string válida' })
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  descricao?: string;

  /**
   * Status do chamado.
   *
   * - Deve ser um número positivo.
   * - Deve ser 0, 1, 2 ou 3.
   */
  @IsOptional()
  @ApiPropertyOptional({ description: 'Status do chamado, 0 = iniciado, 1 = em andamento, 2 = enviado para NL2, 3 = concluído, 4 = cancelado', example: 0 })
  @IsNumber({}, { message: 'status deve ser um número' })
  @IsIn([0, 1, 2, 3], { message: 'O status deve ser 0, 1, 2 ou 3.' })
  @Type(() => Number)
  status?: number;

  /**
   * id do usuário que abriu o chamado.
   *
   * - Deve ser um número positivo.
   * - Obrigatório.
   */
  @IsOptional()
  @ApiPropertyOptional({ description: 'id do usuário que abriu o chamado', example: 143 })
  @IsNumber({}, { message: 'status deve ser um número' })
  @IsPositive({ message: 'status deve ser um número positivo' })
  idUser?: number;

  /**
   * Lista de imagens associadas ao chamado.
   * - Deve ser um array de strings.
   * - Se fornecido, o array será transformado em uma única string no formato JSON.
   * - Opcional.
   */
  @ApiPropertyOptional({ type: [String], description: 'Lista de imagens associadas ao chamado', example: ['image1.jpg', 'image2.jpg'] })
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
  @ApiPropertyOptional({ type: [String], description: 'Lista de imagens associadas ao chamado', example: ['image1.jpg', 'image2.jpg'] })
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
  @IsOptional()
  @ApiPropertyOptional({ description: 'Resposta do chamado', example: 'Resposta do chamado' })
  @IsString({ message: 'Resposta deve ser uma string válida' })
  @IsNotEmpty({ message: 'Resposta é obrigatória' })
  resposta?: string;

  

  @ApiPropertyOptional({ description: 'id de quem respondeu', example: 0 })
  @IsOptional()
  @IsNumber({}, { message: 'idResposta deve ser um número' })
  idResposta?: number;
}
