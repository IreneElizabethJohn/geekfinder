import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Post } from 'src/Schemas/Post.schema';
import { CommentDto, CreatePostDto } from './dtos/CreatePost.dto';
import { User } from 'src/Schemas/User.schema';
import * as AWS from 'aws-sdk';
import { AuthGuard } from 'src/auth/auth.guard';

@Injectable()
export class PostsService {
  s3;
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    const ObjectId = mongoose.Types.ObjectId;
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
  @UseGuards(AuthGuard)
  async createPost(createPostDto: CreatePostDto) {
    let { ownerId, type, content, key } = createPostDto;
    const newPost = new this.postModel({
      ownerId,
      type,
      content,
      ...(key
        ? { imageUrl: `${process.env.POSTS_IMAGE_BASE_URL}/${key}` }
        : {}),
    });
    const savedPost = await newPost.save();
    const followList = await this.userModel
      .findById(createPostDto.ownerId)
      .select({ followers: 1 });

    const result = await this.userModel.updateMany(
      { _id: { $in: followList.followers } },
      {
        $push: {
          relevantPosts: {
            $each: [savedPost._id],
            $position: 0,
            $slice: 200,
          },
        },
      },
    );
    return savedPost;
  }
  @UseGuards(AuthGuard)
  getPosts(ownerId?: string) {
    return this.postModel.find({ ownerId: ownerId }).populate([
      { path: 'ownerId', select: 'avatarUrl displayName' },
      { path: 'joinRequests', select: 'avatarUrl displayName' },
    ]);
  }
  @UseGuards(AuthGuard)
  getComments(postId) {
    return this.postModel
      .findById(postId)
      .select({ comments: 1 })
      .populate({ path: 'comments.owner', select: 'avatarUrl displayName' });
  }

  async addLikes(postId: string, userId: string) {
    await this.postModel.findOneAndUpdate(
      { _id: postId },
      { $push: { likes: userId } },
      {
        new: true,
      },
    );
    return true;
  }
  @UseGuards(AuthGuard)
  async addComments(postId: string, commentDto: CommentDto) {
    const payload: any = {
      ...commentDto,
    };
    payload.owner = payload.userId;
    delete payload.userId;
    await this.postModel.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: payload } },
      {
        new: true,
      },
    );
    return true;
  }
  @UseGuards(AuthGuard)
  async addJoinRequests(postId: string, userId: string) {
    await this.postModel.findOneAndUpdate(
      { _id: postId },
      { $push: { joinRequests: userId } },
      {
        new: true,
      },
    );
    return true;
  }
}
