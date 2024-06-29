import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './DTO/create_user.dto';
import { UserPresenter } from './user.presenter';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post()
  async create(@Body() data: createUserDto) {
    const dataCreated = await this.userService.create(data);
    return new UserPresenter(dataCreated);
  }
}
