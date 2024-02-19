import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  CommentDto,
  CreatePostDto,
  addJoinReqDto,
  addLikeDto,
  getPostsDto,
} from './dtos/CreatePost.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @Get('/signedUrl')
  getSignedUrl(
    @Query()
    { fileName, contentType },
  ) {
    return this.postService.getSignedUrlForFileUpload(fileName, contentType);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }

  @Post(':postId/likes')
  @UsePipes(new ValidationPipe())
  addLikes(@Param('postId') postId: string, @Body() addLikeDto: addLikeDto) {
    return this.postService.addLikes(postId, addLikeDto.userId);
  }

  @Post(':postId/comments')
  @UsePipes(new ValidationPipe())
  addComments(@Param('postId') postId: string, @Body() commentDto: CommentDto) {
    return this.postService.addComments(postId, commentDto);
  }

  @Get(':postId/comments')
  @UsePipes(new ValidationPipe())
  getComments(@Param('postId') postId: string) {
    return this.postService.getComments(postId);
  }

  @Post(':postId/joinRequests')
  @UsePipes(new ValidationPipe())
  addJoinRequests(
    @Param('postId') postId: string,
    @Body() @Body() addJoinReqDto: addJoinReqDto,
  ) {
    return this.postService.addJoinRequests(postId, addJoinReqDto.userId);
  }

  @Get()
  getPosts(@Query() query: getPostsDto) {
    return this.postService.getPosts(query.ownerId);
  }
}
