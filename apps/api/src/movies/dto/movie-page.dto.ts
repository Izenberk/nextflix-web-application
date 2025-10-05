import { ApiProperty } from '@nestjs/swagger';
import { MovieSummaryDto } from './movie-summary.dto';

export class MoviePageDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ type: [MovieSummaryDto] })
  items!: MovieSummaryDto[];
}
