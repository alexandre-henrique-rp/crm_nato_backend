import { PartialType } from '@nestjs/swagger';
import { CreateConstrutoraDto } from './create-construtora.dto';
import { IsOptional } from 'class-validator';

export class UpdateConstrutoraDto extends PartialType(CreateConstrutoraDto) {}
