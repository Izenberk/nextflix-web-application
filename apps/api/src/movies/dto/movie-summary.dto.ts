import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MovieSummaryDto {
  @ApiProperty({ example: 634492 }) id!: number;
  @ApiProperty({ example: 'Mad Max: Fury Road' }) title!: string;

  @ApiPropertyOptional({ example: 'In a post-apocalyptic wasteland...' })
  overview?: string;

  @ApiProperty({ example: '/abc123.jpg' }) posterPath!: string;
  @ApiProperty({ example: '2015-05-15', format: 'date' }) releaseDate!: string;
  @ApiProperty({ example: 7.8, format: 'float' }) voteAverage!: number;
}
