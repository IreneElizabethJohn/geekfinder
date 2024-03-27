import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCollaboratorDto {
  @IsNotEmpty()
  @IsString()
  projectName: string;

  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @IsString()
  @IsNotEmpty()
  collaboratorId: string;
}

export class DescriptionDto {
  description: string;
}

export class RemoveProjectDto {
  projectName: string;
  ownerId: string;
}

export class UpdateRoleDto {
  role: string;
}
