import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MovieSummaryDto {
  @ApiProperty({ example: 634492 }) id!: number;
  @ApiProperty({ example: 'Mad Max: Fury Road' }) title!: string;

  @ApiPropertyOptional({ example: 'In a post-apocalyptic wasteland...' })
  overview?: string;

  @ApiPropertyOptional({
    example: 'https://image.tmdb.org/t/p/w342/abc.jpg',
    nullable: true,
  })
  posterUrl?: string | null;

  @ApiPropertyOptional({
    example: 'https://image.tmdb.org/t/p/w780/def.jpg',
    nullable: true,
  })
  backdropUrl?: string | null;

  @ApiPropertyOptional({
    example: '2015-05-15',
    format: 'date',
    nullable: true,
  })
  releaseDate?: string | null;

  @ApiProperty({ example: 7.8, format: 'float', minimum: 0, maximum: 10 })
  voteAverage!: number;
}
