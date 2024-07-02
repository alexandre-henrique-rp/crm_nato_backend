import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { createUserDto } from './dto/create_user.dto';
import { UserPresenter } from './user.presenter';
import { UserService } from './user.service';
import { AuthGuard } from '../auth.guard';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post()
  async create(@Body() data: createUserDto) {
    const dataCreated = await this.userService.create(data);
    return new UserPresenter(dataCreated);
  }

  @Get()
  async findAll() {
    const data = await this.userService.findAll();
    return data.map((user) => new UserPresenter(user));
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const data = await this.userService.findByid(id);
    return new UserPresenter(data);
  }

  @Put('/update/:id')
  async update(@Param('id') id: number, @Body() data: any) {
    const dataUpdated = await this.userService.update(id, data);
    return new UserPresenter(dataUpdated);
  }

  @Put('/update/password')
  async updatePassword(@Body() data: any) {
    const dataUpdated = await this.userService.updatePassword(
      data.email,
      data.password,
    );
    return new UserPresenter(dataUpdated);
  }
}
