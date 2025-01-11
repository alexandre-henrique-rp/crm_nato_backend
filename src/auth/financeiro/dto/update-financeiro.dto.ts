import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateFinanceiroDto } from "./create-financeiro.dto";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UpdateFinanceiroDto extends PartialType(CreateFinanceiroDto)  {

    // @ApiProperty({description:'Razão Social da Empresa', example:'Nome da Empresa'})
    // @MinLength(1,{message: 'O Razão Social é obrigatório'})
    // razaosocial: string

}