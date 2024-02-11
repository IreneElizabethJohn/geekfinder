import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Connection, Model } from 'mongoose';
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
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const saltOrRounds = 10;
    const password = createUserDto.password;
    const hash = await bcrypt.hash(password, saltOrRounds);
    createUserDto.password = hash;

    const newUser = new this.userModel(createUserDto);
    const user = await newUser.save();
    return user;
  }

  async getUserByEmail(email: string) {
    try {
      const existingUser = await this.userModel.findOne({
        email: email,
      });
      return existingUser;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  getUsers() {
    return this.userModel
      .find({ isDeleted: false })
      .populate(['settings', 'posts']);
  }

  getUserById(id: string) {
    return this.userModel
      .findOne({ _id: id, isDeleted: false })
      .select({ password: 0 })
      .populate([
        {
          path: 'followers',
          select: 'displayName avatarUrl',
        },
        {
          path: 'following',
          select: 'displayName avatarUrl',
        },
      ]);
  }

  updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      updateUserDto,
      {
        new: true,
      },
    );
  }

  deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async insertFollower(userId: string, followeeId: string) {
    const session = await this.userModel.db.startSession();
    session.startTransaction();
    try {
      await this.userModel
        .findOneAndUpdate(
          { _id: userId },
          {
            $push: {
              following: followeeId,
            },
          },
          { new: true },
        )
        .session(session);

      await this.userModel
        .findOneAndUpdate({ _id: followeeId }, { $push: { followers: userId } })
        .session(session);

      await session.commitTransaction();
      return true;
    } catch (error) {
      await session.abortTransaction();
      console.error(error);
    }
  }
}
