import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { MoviePageDto } from './dto/movie-page.dto';

function coercePage(p?: string) {
  return Math.max(1, Number(p) || 1);
}
function coerceRegion(r?: string) {
  return r && /^[A-Za-z]{2}$/.test(r) ? r.toUpperCase() : undefined;
}

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly svc: MoviesService) {}

  @Get('popular')
  @ApiOperation({ summary: 'Popular movies' })
  @ApiQuery({
    name: 'page',
    required: false,
    schema: { type: 'integer', minimum: 1, default: 1 },
  })
  @ApiQuery({
    name: 'language',
    required: false,
    schema: { type: 'string', default: 'en-US' },
  })
  @ApiQuery({
    name: 'region',
    required: false,
    schema: { type: 'string', minLength: 2, maxLength: 2 },
  })
  @ApiOkResponse({ description: 'Popular page', type: MoviePageDto })
  async popular(
    @Query('page') page?: string,
    @Query('language') language?: string,
    @Query('region') region?: string,
  ): Promise<MoviePageDto> {
    const p = coercePage(page);
    const r = coerceRegion(region);
    const items = await this.svc.getPopular(p, { language, region: r });
    return { page: p, items };
  }

  @Get('top-rated')
  @ApiOperation({ summary: 'Top rated movies' })
  @ApiQuery({
    name: 'page',
    required: false,
    schema: { type: 'integer', minimum: 1, default: 1 },
  })
  @ApiQuery({
    name: 'language',
    required: false,
    schema: { type: 'string', default: 'en-US' },
  })
  @ApiQuery({
    name: 'region',
    required: false,
    schema: { type: 'string', minLength: 2, maxLength: 2 },
  })
  @ApiOkResponse({ description: 'Top rated page', type: MoviePageDto })
  async topRated(
    @Query('page') page?: string,
    @Query('language') language?: string,
    @Query('region') region?: string,
  ): Promise<MoviePageDto> {
    const p = coercePage(page);
    const r = coerceRegion(region);
    const items = await this.svc.getTopRated(p, { language, region: r });
    return { page: p, items };
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Upcoming movies' })
  @ApiQuery({
    name: 'page',
    required: false,
    schema: { type: 'integer', minimum: 1, default: 1 },
  })
  @ApiQuery({
    name: 'language',
    required: false,
    schema: { type: 'string', default: 'en-US' },
  })
  @ApiQuery({
    name: 'region',
    required: false,
    schema: { type: 'string', minLength: 2, maxLength: 2 },
  })
  @ApiOkResponse({ description: 'Upcoming page', type: MoviePageDto })
  async upcoming(
    @Query('page') page?: string,
    @Query('language') language?: string,
    @Query('region') region?: string,
  ): Promise<MoviePageDto> {
    const p = coercePage(page);
    const r = coerceRegion(region);
    const items = await this.svc.getUpcoming(p, { language, region: r });
    return { page: p, items };
  }

  @Get('now-playing')
  @ApiOperation({ summary: 'Now playing movies' })
  @ApiQuery({
    name: 'page',
    required: false,
    schema: { type: 'integer', minimum: 1, default: 1 },
  })
  @ApiQuery({
    name: 'language',
    required: false,
    schema: { type: 'string', default: 'en-US' },
  })
  @ApiQuery({
    name: 'region',
    required: false,
    schema: { type: 'string', minLength: 2, maxLength: 2 },
  })
  @ApiOkResponse({ description: 'Now playing page', type: MoviePageDto })
  async nowPlaying(
    @Query('page') page?: string,
    @Query('language') language?: string,
    @Query('region') region?: string,
  ): Promise<MoviePageDto> {
    const p = coercePage(page);
    const r = coerceRegion(region);
    const items = await this.svc.getNowPlaying(p, { language, region: r });
    return { page: p, items };
  }
}
