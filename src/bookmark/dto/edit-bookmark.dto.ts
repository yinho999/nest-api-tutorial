import { IsOptional, IsString } from 'class-validator';

class EditBookmarkDto {
  @IsString()
  @IsOptional()
  readonly title?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  @IsOptional()
  readonly link?: string;
}

export default EditBookmarkDto;
