import { ApiProperty } from '@nestjs/swagger';

export class MovieVideoDto {
  @ApiProperty() name!: string;
  @ApiProperty() site!: 'YouTube' | 'Vimeo';
  @ApiProperty() key!: string; // e.g. YouTube id
  @ApiProperty() type!: string; // Trailer/Teaser/Clip
  @ApiProperty({ required: false }) official?: boolean;
  @ApiProperty({ required: false }) published_at?: string;
}

export class MovieVideosDto {
  @ApiProperty({ type: [MovieVideoDto] }) results!: MovieVideoDto[];
}
