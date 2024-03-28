import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UsersService } from './users.service';
import mongoose from 'mongoose';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { generateProfileUrl } from 'src/utils';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { followUserDto } from './dto/followUser.dto';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('/sign-up')
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.getUserByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('User already exists!');
    }

    createUserDto.avatarUrl = generateProfileUrl(createUserDto.email);

    const user = await this.usersService.createUser(createUserDto);

    const payload = { userId: user._id, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    return {
      accessToken: token,
      userId: user._id,
      avatarUrl: user.avatarUrl,
    };
  }

  @Post('/sign-in')
  @UsePipes(new ValidationPipe())
  async signIn(@Body() userDto: CreateUserDto) {
    const existingUser = await this.usersService.getUserByEmail(userDto.email);
    if (!existingUser) {
      throw new BadRequestException('User not found');
    }

    const isMatch = await bcrypt.compare(
      userDto.password,
      existingUser.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = {
      userId: existingUser._id,
      email: existingUser.email,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      accessToken: token,
      userId: existingUser._id,
      avatarUrl: existingUser.avatarUrl,
    };
  }

  @UseGuards(AuthGuard)
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string, @Request() req) {
    const findUser = await this.usersService.getUserById(id);
    if (!findUser) {
      throw new HttpException('User not found', 404);
    }
    return findUser;
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    if (req.user.userId != id) {
      throw new ForbiddenException();
    }
    const updateUser = await this.usersService.updateUser(id, updateUserDto);
    if (!updateUser) {
      throw new HttpException('User not found', 404);
    }
    return updateUser;
  }

  @UseGuards(AuthGuard)
  @Post(':id/following')
  @UsePipes(new ValidationPipe())
  async followUser(
    @Param('id') id: string,
    @Body() followUserDto: followUserDto,
  ) {
    return await this.usersService.insertFollower(id, followUserDto.followeeId);
  }

  @UseGuards(AuthGuard)
  @Get(':id/feed')
  async getFeedPosts(@Param('id') id: string) {
    return this.usersService.getFeedPosts(id);
  }

  @Get(':id/projects')
  getProjects(@Param('id') id: string) {
    return this.usersService.getProjects(id);
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
