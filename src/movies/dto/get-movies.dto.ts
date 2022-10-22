import { IsNumber, IsOptional } from 'class-validator';

export class GetMoviesDto {
  @IsOptional()
  @IsNumber()
  duration?: number;
}
