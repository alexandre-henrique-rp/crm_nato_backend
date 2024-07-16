import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UserPresenter } from './user.presenter';
import { UserService } from './user.service';
import { AuthGuard } from '../auth.guard';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  async findAll() {
    const data = await this.userService.findAll();
    return data.map((user) => new UserPresenter(user));
  }

  @Get('/:id')
  async findOne(@Param('id') id: number) {
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

  @Put('/reset_password/:id')
  async resetpassword(@Body() data: any, @Param('id') id: number) {
    const dataUpdated = await this.userService.primeAcess(id, data);
    return new UserPresenter(dataUpdated);
  }
}
