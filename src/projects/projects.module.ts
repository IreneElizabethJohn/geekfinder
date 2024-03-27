import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from 'src/Schemas/Project.schema';
import { User, UserSchema } from 'src/Schemas/User.schema';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Post, PostSchema } from 'src/Schemas/Post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Project.name,
        schema: ProjectSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
