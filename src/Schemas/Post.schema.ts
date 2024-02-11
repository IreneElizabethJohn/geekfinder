import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Post {
  @Prop({ required: true })
  ownerId: string;
  @Prop({ required: true })
  content: string;
  @Prop({ required: false })
  imageUrl: string;
  @Prop({ required: true })
  type: string;
}
export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.set('timestamps', true);
