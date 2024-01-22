import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  isBoolean,
} from 'class-validator';

export class CreateUserSettingsDto {
  @IsOptional()
  @IsBoolean()
  recieveNotifications: boolean;

  @IsOptional()
  @IsBoolean()
  recieveEmails: boolean;

  @IsBoolean()
  recieveSMS: boolean;
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserSettingsDto)
  settings?: CreateUserSettingsDto;
}
