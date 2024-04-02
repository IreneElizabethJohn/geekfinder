import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Project {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: mongoose.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description: string;

  @Prop({
    required: false,
    type: [
      {
        role: { type: String },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
  })
  collaborators: Collaborator[];

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'Task' })
  tasks: mongoose.Types.ObjectId[];
}
export const ProjectSchema = SchemaFactory.createForClass(Project);
ProjectSchema.set('timestamps', true);

class Collaborator {
  role: string;
  user: string;
}
