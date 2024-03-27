import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Project } from 'src/Schemas/Project.schema';
import { User } from 'src/Schemas/User.schema';
import {
  CreateCollaboratorDto,
  DescriptionDto,
  RemoveProjectDto,
} from './dtos/CreateCollaborator.dto';
import { Post } from 'src/Schemas/Post.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) {}

  async createProject(projectName: string, ownerId: string) {
    const project = new this.projectModel({
      title: projectName,
      owner: ownerId,
      collaborators: [
        {
          user: ownerId,
          role: 'owner',
        },
      ],
    });

    await this.userModel.findByIdAndUpdate(
      { _id: ownerId },
      {
        $push: { projects: project },
      },
    );
    await project.save();
  }

  async addDescription(dto: DescriptionDto, id: string) {
    const updatedProject = await this.projectModel.findOneAndUpdate(
      { _id: id },
      { description: dto.description }, //conditionally change
      { new: true },
    );
    return updatedProject;
  }

  async addCollaborator(createCollaboratorDto: CreateCollaboratorDto) {
    const collaborator = await this.projectModel.findOneAndUpdate(
      {
        owner: createCollaboratorDto.ownerId,
        title: createCollaboratorDto.projectName,
      },
      {
        $push: {
          collaborators: {
            user: createCollaboratorDto.collaboratorId,
            role: 'collaborator',
          },
        },
      },
      { new: true },
    );
    await this.userModel.findByIdAndUpdate(
      { _id: createCollaboratorDto.collaboratorId },
      {
        $push: { projects: collaborator._id },
      },
    );

    return collaborator;
  }

  async changeCollaboratorRole(
    projectId: string,
    collaboratorId: string,
    role: string,
  ) {
    let project = await this.projectModel.findById(projectId);
    const updatedCollaborator = { user: collaboratorId, role: role };
    const collaborators = project.collaborators.map((item) =>
      String(item.user) == collaboratorId ? updatedCollaborator : item,
    );
    //@ts-ignore
    project.collaborators = collaborators;
    await project.save();
    return true;
  }

  async removeCollaborator(projectId: string, collaboratorId: string) {
    // Retrieve the project document from the database
    const project: any = await this.projectModel.findById(projectId);

    if (!project) {
      // If the project is not found, handle the error
      throw new Error('Project not found');
    }
    // Find the index of the collaborator to remove
    const indexToRemove = project.collaborators.findIndex((collaborator) => {
      if (String(collaborator.user) == collaboratorId) return collaborator.user;
    });

    if (indexToRemove === -1) {
      // If the collaborator is not found in the list, handle the error
      throw new Error('Collaborator not found in the project');
    }

    // Remove the collaborator from the list
    project.collaborators.splice(indexToRemove, 1);

    // Save the updated project document back to the database
    await project.save();

    return project;
  }

  async removeProject(dto: RemoveProjectDto) {
    const { projectName, ownerId } = dto;

    const projectToBeDeleted = await this.projectModel.findOne({
      title: projectName,
      owner: ownerId,
    });
    const projectId = projectToBeDeleted._id;
    await this.projectModel.findByIdAndDelete(projectId);
    await this.postModel.findOneAndDelete({
      projectName: projectName,
      ownerId: ownerId,
    });

    await this.userModel.updateMany(
      { _id: ownerId },
      { $pull: { projects: projectId } },
    );

    return true;
  }

  async getProjectDetails(projectId: string) {
    return await this.projectModel.findById(projectId).populate({
      path: 'collaborators.user',
      select: 'avatarUrl displayName',
    });
  }
}
