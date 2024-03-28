import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class Experience {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  fromDate?: Date;

  @IsOptional()
  toDate?: Date;
}

export class SocialLink {
  github: string;
  linkedIn: string;
}

export class Education {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  instituteName?: string;

  @IsOptional()
  fromDate?: Date;

  @IsOptional()
  toDate?: Date;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @ValidateNested()
  @IsArray()
  experience?: Experience[];

  @IsOptional()
  @ValidateNested()
  @IsArray()
  education?: Education[];

  @IsOptional()
  socialLinks?: SocialLink;
}
