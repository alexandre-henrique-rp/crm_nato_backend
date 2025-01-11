import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from '../dto/create_user.dto';
import { UserPresenter } from '../user.presenter';
import { UserService } from '../user.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User')
export class UserController2 {
  constructor(private userService: UserService) {}
  // @Post('/')
  // async create(@Body() data: CreateUserDto) {
  //   try {
  //     const dataCreated = await this.userService.create(data);
  //     return new UserPresenter(dataCreated);
  //   } catch (error) {
  //     if (error.meta.target === 'nato_user_unique_1') {
  //       return { mensage: 'Esse E-mail não pode ser usado' };
  //     }
  //     if (error.meta.target === 'nato_user_unique') {
  //       return { mensage: 'Esse Username não pode ser usado' };
  //     }
  //     return error;
  //   }
  // }

  @Get('/cca/:EmpreendimentoId')
  async CCA(@Param('EmpreendimentoId') EmpreendimentoId: number) {
    return await this.userService.CCA(EmpreendimentoId);
  }

  @Post('/update/pass2/:id')
  async updatePassword(@Param('id') id: number) {
    return await this.userService.updatePassword(Number(id), '1234');
  }
}
