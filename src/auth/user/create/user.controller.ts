import { Body, Controller, Post } from '@nestjs/common';
import { createUserDto } from '../dto/create_user.dto';
import { UserPresenter } from '../user.presenter';
import { UserService } from '../user.service';

@Controller('user')
export class UserController2 {
  constructor(private userService: UserService) {}
  @Post('/')
  async create(@Body() data: createUserDto) {
    try {
      const dataCreated = await this.userService.create(data);
      return new UserPresenter(dataCreated);
    } catch (error) {
      if (error.meta.target === 'nato_user_unique_1') {
        return { mensage: 'Esse E-mail não pode ser usado' };
      }
      if (error.meta.target === 'nato_user_unique') {
        return { mensage: 'Esse Username não pode ser usado' };
      }
      return error;
    }
  }
}
