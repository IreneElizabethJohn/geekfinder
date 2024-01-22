import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserSettings } from './UserSettings.schema';
import { Post } from './Post.schema';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;
  @Prop({ required: false })
  displayName?: string;
  @Prop({ required: false })
  avatarUrl?: string;
  @Prop({ required: false })
  email?: string;
  @Prop({ required: true })
  password: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserSettings' })
  settings?: UserSettings;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
  posts?: Post[];
}

export const UserSchema = SchemaFactory.createForClass(User);
