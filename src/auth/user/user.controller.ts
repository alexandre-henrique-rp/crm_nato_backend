import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserPresenter } from './user.presenter';
import { UserService } from './user.service';
import { AuthGuard } from '../auth.guard';
import { TermoUserDto } from './dto/termo-user.dto';
import { CreateUserDto } from './dto/create_user.dto';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  async findAll() {
    const data = await this.userService.findAll();
    return data;
  }

  @Get('/get/:id')
  async findOne(@Param('id') id: number) {
    const data = await this.userService.findByid(id);
    return new UserPresenter(data);
  }

  @Get('/construtora/:id')
  async findCorretorByConstrutora(@Param('id', new ParseIntPipe()) id: number) {
    const data = await this.userService.getCorretorByConstrutora(id);
    return data;
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

  @Delete('/suspense/:id')
  async suspense(@Param('id') id: number) {
    const data = { status: false };
    const dataUpdated = await this.userService.update(id, data);
    return new UserPresenter(dataUpdated);
  }
  @Delete('/delete/:id')
  async delete(@Param('id') id: number) {
    const dataUpdated = await this.userService.delete(id);
    return new UserPresenter(dataUpdated);
  }

  @Get('/Busca/')
  async Search(@Query() query: any) {
    const { empreedimento, financeiro, construtora,telefone, email, cpf, hierarquia} = query
    const data = await this.userService.search(empreedimento, financeiro, construtora, telefone, email, cpf, hierarquia);
    return data;
  }

  @Get('/termo/:id')
  async userTermo(@Param('id') id: number) {
    return await this.userService.userTermo(+id);
}

  @Put('/termo/:id')
  async updateTermo(@Param('id') id: number, @Body() data: TermoUserDto) {
    return await this.userService.updateTermo(+id, data);
  }

  @Post('/create')
  async create(@Body() CreateUserDto: CreateUserDto) {
    return await this.userService.create(CreateUserDto);
  }
}
