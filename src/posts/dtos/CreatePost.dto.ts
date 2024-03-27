import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content: string;

  @IsString()
  @IsOptional()
  key?: string;

  @IsString()
  type: string;

  @IsString()
  @IsOptional()
  projectName?: string;
}

export class Comments {
  owner: string;
  comment: string;
  createdAt: Date;
}

export class CommentDto {
  userId: string;
  comment: string;
}

export class addLikeDto {
  userId: string;
}
export class addJoinReqDto {
  userId: string;
}

export class getPostsDto {
  ownerId?: string;
}
