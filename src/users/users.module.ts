import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/Schemas/User.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/configs/jwt.config';
import { PostsService } from 'src/posts/posts.service';
import { Post, PostSchema } from 'src/Schemas/Post.schema';
import { ProjectSchema, Project } from 'src/Schemas/Project.schema';
import { ProjectsService } from 'src/projects/projects.service';
import { Task, TaskSchema } from 'src/Schemas/Task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: Project.name,
        schema: ProjectSchema,
      },
      {
        name: Task.name,
        schema: TaskSchema,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [UsersService, PostsService, ProjectsService],
  controllers: [UsersController],
})
export class UsersModule {}
