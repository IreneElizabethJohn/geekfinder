import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UsersService } from './users.service';
import mongoose from 'mongoose';
import { UpdateUserDto } from './dto/UpdateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/sign-up')
  @UsePipes(new ValidationPipe())
  createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.usersService.createUser(createUserDto);
  }

  @Post('/sign-in')
  @UsePipes(new ValidationPipe())
  signIn(@Body() userDto: CreateUserDto) {
    return this.usersService.signIn(userDto);
  }

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const idValid = mongoose.Types.ObjectId.isValid(id);
    if (!idValid) {
      throw new HttpException('User not found', 404);
    }
    const findUser = await this.usersService.getUserById(id);
    if (!findUser) {
      throw new HttpException('User not found', 404);
    }
    return findUser;
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const idValid = mongoose.Types.ObjectId.isValid(id);
    if (!idValid) {
      throw new HttpException('Id invalid', 400);
    }
    const updateUser = await this.usersService.updateUser(id, updateUserDto);
    if (!updateUser) {
      throw new HttpException('User not found', 404);
    }
    return updateUser;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const idValid = mongoose.Types.ObjectId.isValid(id);
    if (!idValid) {
      throw new HttpException('Id invalid', 400);
    }
    const deleteUser = await this.usersService.deleteUser(id);
    if (!deleteUser) {
      throw new HttpException('User not found', 404);
    }
    return;
  }
}
