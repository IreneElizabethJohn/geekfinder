import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/Schemas/Post.schema';
import { CreatePostDto } from './dtos/CreatePost.dto';
import { User } from 'src/Schemas/User.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createPost({ userId, ...createPostDto }: CreatePostDto) {
    const findUser = await this.userModel.findById(userId);
    if (!findUser) return null;
    const newPost = new this.postModel(createPostDto);
    const savedPost = await newPost.save();
    await findUser.updateOne({
      $push: {
        posts: savedPost._id,
      },
    });
    return savedPost;
  }
  findPostById() {}
}
