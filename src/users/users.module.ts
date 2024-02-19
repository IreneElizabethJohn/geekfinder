import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/Schemas/User.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {
  UserSettings,
  UserSettingsSchema,
} from 'src/Schemas/UserSettings.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/configs/jwt.config';
import { PostsService } from 'src/posts/posts.service';
import { Post, PostSchema } from 'src/Schemas/Post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: UserSettings.name,
        schema: UserSettingsSchema,
      },
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [UsersService, PostsService],
  controllers: [UsersController],
})
export class UsersModule {}
