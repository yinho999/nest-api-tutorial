import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

class CreateBookmarkDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  @IsNotEmpty()
  readonly link: string;
}

export default CreateBookmarkDto;
