import { ApiProperty } from '@nestjs/swagger';

export class ErrorClienteType {
  @ApiProperty({
    description: 'Mensagem de erro',
    type: String,
  })
  message: string;
}
