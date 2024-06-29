import { Body, Controller, Post } from '@nestjs/common';
import { createUserDto } from './dto/create_user.dto';
import { UserPresenter } from './user.presenter';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post()
  async create(@Body() data: createUserDto) {
    const dataCreated = await this.userService.create(data);
    return new UserPresenter(dataCreated);
  }
}
