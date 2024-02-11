import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/Schemas/Post.schema';
import { CreatePostDto } from './dtos/CreatePost.dto';
import { User } from 'src/Schemas/User.schema';
import * as AWS from 'aws-sdk';

@Injectable()
export class PostsService {
  s3;
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.S3_ACCESSKEYID,
      secretAccessKey: process.env.S3_SECRETACCESSKEY,
    });
  }

  getSignedUrlForFileUpload(fileName: string, contentType: string) {
    const key = new Date().getTime() + '_' + fileName;
    const presignedPUTURL = this.s3.getSignedUrl('putObject', {
      Bucket: 'geekfinderbucket',
      Key: key,
      Expires: 10000,
      ContentType: contentType,
    });
    return { presignedPUTURL, key };
  }

  async createPost(createPostDto: CreatePostDto) {
    let { ownerId, type, content, key } = createPostDto;
    const findUser = await this.userModel.findById(ownerId);
    if (!findUser) return null;
    const payload = {
      ownerId: ownerId,
      type: type,
      content: content,
      imageUrl: `${process.env.POSTS_IMAGE_BASE_URL}/${key}`,
    };
    const newPost = new this.postModel(payload);
    const savedPost = await newPost.save();
    await findUser.updateOne({
      $push: {
        relevantPosts: savedPost._id,
      },
    });
    return savedPost;
  }
  findPostById() {}
}
