import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/Schemas/User.schema';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { UserSettings } from 'src/Schemas/UserSettings.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserSettings.name)
    private userSettingsModel: Model<UserSettings>,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      username: createUserDto.username,
    });
    if (existingUser) {
      throw new BadRequestException();
    }

    const saltOrRounds = 10;
    const password = createUserDto.password;
    const hash = await bcrypt.hash(password, saltOrRounds);
    createUserDto.password = hash;

    const newUser = new this.userModel(createUserDto);
    const user = await newUser.save();
    const payload = { userId: user._id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signIn(userDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      username: userDto.username,
    });

    const isMatch = await bcrypt.compare(
      userDto.password,
      existingUser.password,
    );
    if (!isMatch) {
      throw new BadRequestException();
    }

    const payload = {
      userId: existingUser._id,
      username: existingUser.username,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  getUsers() {
    return this.userModel.find().populate(['settings', 'posts']);
  }

  getUserById(id: string) {
    return this.userModel.findById(id);
  }

  updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
