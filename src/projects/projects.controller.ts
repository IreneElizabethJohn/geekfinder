import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import {
  CreateCollaboratorDto,
  DescriptionDto,
  RemoveProjectDto,
  UpdateRoleDto,
} from './dtos/CreateCollaborator.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private projectService: ProjectsService) {}

  @Patch('/:projectId')
  addDescription(
    @Body() descriptionDto: DescriptionDto,
    @Param('projectId') projectId: string,
  ) {
    return this.projectService.addDescription(descriptionDto, projectId);
  }

  @Post('/collaborator')
  addCollaborator(@Body() createCollaboratorDto: CreateCollaboratorDto) {
    return this.projectService.addCollaborator(createCollaboratorDto);
  }

  @Put('/:projectId/collaborators/:collaboratorId/role')
  changeCollaboratorRole(
    @Param('projectId') projectId: string,
    @Param('collaboratorId') collaboratorId: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.projectService.changeCollaboratorRole(
      projectId,
      collaboratorId,
      updateRoleDto.role,
    );
  }

  @Delete('/:projectId/collaborators/:collaboratorId')
  removeCollaborator(
    @Param('projectId') projectId: string,
    @Param('collaboratorId') collaboratorId: string,
  ) {
    return this.projectService.removeCollaborator(projectId, collaboratorId);
  }

  @Delete()
  removeProject(@Body() removeProjectDto: RemoveProjectDto) {
    return this.projectService.removeProject(removeProjectDto);
  }

  @Get('/:projectId')
  getProjectDetails(@Param('projectId') projectId: string) {
    return this.projectService.getProjectDetails(projectId);
  }
}
