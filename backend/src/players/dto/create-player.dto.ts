import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  place?: string;

  @IsOptional()
  @IsInt()
  @Min(3)
  @Max(99)
  age?: number;

  @IsOptional()
  @IsString()
  gender?: string;
}
