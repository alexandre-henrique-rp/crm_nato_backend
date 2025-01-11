import { IsBoolean } from "class-validator";

export class TermoUserDto {
  @IsBoolean()
  termo: boolean
}