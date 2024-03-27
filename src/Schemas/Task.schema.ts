import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum } from 'class-validator';
import mongoose from 'mongoose';

export enum Status {
  TODO = 'Todo',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
}

export enum Type {
  DEVELOPMENT = 'Development',
  TESTING = 'Testing',
  DEPLOYMENT = 'Deployment',
  DOCUMENTATION = 'Documentation',
}

export class Assignee {
  userId: mongoose.Schema.Types.ObjectId;
}

@Schema()
export class Task {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: mongoose.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  @IsEnum(Type)
  type: Type;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  assignee: Assignee;

  @Prop({ required: false })
  @IsEnum(Status)
  status: Status;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  })
  projectId: mongoose.Types.ObjectId;
}
export const TaskSchema = SchemaFactory.createForClass(Task);
TaskSchema.set('timestamps', true);
