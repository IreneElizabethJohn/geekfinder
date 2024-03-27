import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/Schemas/User.schema';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import * as bcrypt from 'bcrypt';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private postService: PostsService,
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

  async getUserById(id: string) {
    const userDetails: any = await this.userModel
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

    const posts = await this.postService.getPosts(id);
    return { ...userDetails._doc, posts };
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
  async getFeedPosts(id: string) {
    const feed = await this.userModel
      .findOne({ _id: id, isDeleted: false })
      .select({ relevantPosts: 1 })
      .populate({
        path: 'relevantPosts',
        populate: {
          path: 'ownerId',
          select: 'displayName avatarUrl',
        },
      })
      .sort('-relevantPosts.createdAt');

    return feed;
  }

  async getProjects(ownerId: string) {
    return await this.userModel
      .findById(ownerId)
      .select({ projects: 1 })
      .populate({ path: 'projects' });
  }
}
