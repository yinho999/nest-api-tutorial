import { IsEmail, IsOptional, IsString } from 'class-validator';

class EditUserDto {
  @IsString()
  @IsOptional()
  readonly firstName?: string;

  @IsString()
  @IsOptional()
  readonly lastName?: string;
  @IsEmail()
  @IsOptional()
  readonly email?: string;
}

export default EditUserDto;
