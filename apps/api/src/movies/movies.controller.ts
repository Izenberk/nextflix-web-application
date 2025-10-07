import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { MoviePageDto } from './dto/movie-page.dto';
import { MovieVideosDto } from './dto/movie-video.dto';

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

  @Get(':id/videos')
  @ApiOperation({ summary: 'Videos for a movie (trailers/teasers)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiQuery({
    name: 'language',
    required: false,
    schema: { type: 'string', default: 'en-US' },
  })
  @ApiQuery({
    name: 'includeVideoLanguage',
    required: false,
    schema: { type: 'string', example: 'en,null' },
    description: 'CSV of fallback languages for videos',
  })
  @ApiOkResponse({ description: 'Videos list', type: MovieVideosDto })
  async videos(
    @Param('id', ParseIntPipe) id: number,
    @Query('language') language?: string,
    @Query('includeVideoLanguage') includeVideoLanguage?: string,
  ): Promise<MovieVideosDto> {
    const results = await this.svc.getVideos(id, {
      language,
      includeVideoLanguage,
    });
    // return minimal fields useful to FE
    return {
      results: results.map((v) => ({
        name: v.name,
        site: v.site as any,
        key: v.key,
        type: v.type,
        official: v.official,
        published_at: v.published_at,
      })),
    };
  }
}
