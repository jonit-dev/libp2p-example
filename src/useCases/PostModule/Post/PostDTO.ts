import { IsDefined, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePostDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  body: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString({ each: true })
  tags: string[];
}

export class UpdatePostDTO extends CreatePostDTO {
  @IsOptional()
  @IsString()
  declare title: string;

  @IsOptional()
  @IsString()
  declare body: string;

  @IsOptional()
  @IsString({ each: true })
  declare tags: string[];
}
