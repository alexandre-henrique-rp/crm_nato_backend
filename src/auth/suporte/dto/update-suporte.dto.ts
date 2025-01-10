import { PartialType } from '@nestjs/swagger';
import { CreateSuporteDto } from './create-suporte.dto';
import { IsOptional } from 'class-validator';

export class UpdateSuporteDto extends PartialType(CreateSuporteDto) {
  @IsOptional()
  tagId: number
}
