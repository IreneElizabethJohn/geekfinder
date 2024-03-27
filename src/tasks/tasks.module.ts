import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/Schemas/Post.schema';
import { Project, ProjectSchema } from 'src/Schemas/Project.schema';
import { Task, TaskSchema } from 'src/Schemas/Task.schema';
import { User, UserSchema } from 'src/Schemas/User.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: Task.name,
        schema: TaskSchema,
      },
      {
        name: Project.name,
        schema: ProjectSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
