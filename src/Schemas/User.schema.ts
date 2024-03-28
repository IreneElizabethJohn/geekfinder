import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Post } from './Post.schema';
import {
  Education,
  Experience,
  SocialLink,
} from 'src/users/dto/UpdateUser.dto';
import { Following, Followers } from 'src/users/dto/followUser.dto';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  displayName?: string;

  @Prop({ required: false })
  avatarUrl?: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  bio?: string;

  @Prop({ required: false })
  experience?: Experience[];

  @Prop({ required: false })
  education?: Education[];

  @Prop({ default: false, required: true })
  isDeleted: boolean;

  @Prop({
    required: false,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  following: Following[];

  @Prop({
    required: false,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  followers: Followers[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
  relevantPosts?: Post[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }] })
  projects: [];

  @Prop({ required: false })
  socialLinks?: SocialLink;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('timestamps', true);
UserSchema.set('toJSON', {
  transform(doc, ret, options) {
    delete ret.password;
    delete ret.isDeleted;
  },
});
