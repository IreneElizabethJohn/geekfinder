import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/Schemas/Post.schema';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { User, UserSchema } from 'src/Schemas/User.schema';
import { ProjectSchema, Project } from 'src/Schemas/Project.schema';
import { ProjectsService } from 'src/projects/projects.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Project.name,
        schema: ProjectSchema,
      },
    ]),
  ],
  providers: [PostsService, ProjectsService],
  controllers: [PostsController],
})
export class PostsModule {}
