import { IsInt, Min } from 'class-validator';

export class UpdateScoreDto {
  @IsInt()
  id: number;

  @IsInt()
  @Min(0)
  score: number;
}
