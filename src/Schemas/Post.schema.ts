import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Comments } from 'src/posts/dtos/CreatePost.dto';

@Schema()
export class Post {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  ownerId: mongoose.Types.ObjectId;
  @Prop({ required: true })
  content: string;
  @Prop({ required: false })
  imageUrl: string;
  @Prop({ required: true })
  type: string;
  @Prop({
    required: false,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  likes: Like[];
  @Prop({
    required: false,
    type: [
      {
        comment: { type: String },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
  })
  comments: Comments[];
  @Prop({
    required: false,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  joinRequests: joinRequests[];
}
export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.set('timestamps', true);

class Like {
  userId: mongoose.Schema.Types.ObjectId;
}
class joinRequests {
  userId: mongoose.Schema.Types.ObjectId;
}
