import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dtos/CreateTaskDto.dto';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Post('/:projectId')
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Param('projectId') projectId: string,
  ) {
    return this.taskService.createTask(createTaskDto, projectId);
  }

  @Delete('/:taskId')
  deleteTask(@Param('taskId') taskId: string) {
    return this.taskService.delete(taskId);
  }

  @Get('/:projectId')
  getTasks(@Param('projectId') projectId: string) {
    return this.taskService.getTasks(projectId);
  }

  @Patch('/:taskId')
  updateTask(
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.updateTask(taskId, updateTaskDto);
  }
}
