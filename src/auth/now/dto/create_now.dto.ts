import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsBoolean, IsDate, IsNotEmpty } from "class-validator"





export class CreateNowDto {
  
  @ApiProperty({ description: 'Ativar o now', example: true })
  @IsBoolean({ message: 'alertanow deve ser true ou false' })
  @Type(() => Boolean)
  alertanow: boolean

  @ApiProperty({ description: 'Data de criação do now', example: true })
  @IsDate({ message: 'dt_criacao_now deve ser uma data' })
  @Type(() => Date)
  dt_criacao_now: Date

}