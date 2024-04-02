import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from 'src/Schemas/Project.schema';
import { Task } from 'src/Schemas/Task.schema';
import { User } from 'src/Schemas/User.schema';
import { CreateTaskDto, UpdateTaskDto } from './dtos/CreateTaskDto.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Task.name) private taskModel: Model<Task>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, projectId: string) {
    try {
      const existingTask = await this.taskModel.findOne({
        title: createTaskDto.title,
      });
      if (existingTask) {
        throw new BadRequestException('Duplicate title');
      }
      const task = new this.taskModel({ ...createTaskDto, projectId });
      return await task.save();
    } catch (error) {
      throw new HttpException(error.message || 'something went wrong', 500);
    }
  }

  async delete(taskId: string) {
    try {
      return await this.taskModel.deleteOne({ _id: taskId });
    } catch {
      throw new HttpException('something went wrong', 500);
    }
  }

  async getTasks(projectId: string) {
    try {
      return await this.taskModel
        .find({ projectId: projectId })
        .populate({ path: 'assignee', select: 'avatarUrl displayName' });
    } catch {
      throw new HttpException('something went wrong', 500);
    }
  }

  async updateTask(taskId: string, updateTaskDto: UpdateTaskDto) {
    return await this.taskModel.findByIdAndUpdate(taskId, {
      ...(updateTaskDto.assignee ? { assignee: updateTaskDto.assignee } : {}),
      ...(updateTaskDto.title ? { title: updateTaskDto.title } : {}),
      ...(updateTaskDto.description
        ? { description: updateTaskDto.description }
        : {}),
      ...(updateTaskDto.type ? { type: updateTaskDto.type } : {}),
      ...(updateTaskDto.status ? { status: updateTaskDto.status } : {}),
    });
  }
}
