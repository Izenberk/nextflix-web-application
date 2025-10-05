import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { PopularQueryDto } from './dto/popular.query.dto';
import { MoviePageDto } from './dto/movie-page.dto';
import { toMovieSummaryDto } from './movies.mapper';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly svc: MoviesService) {}

  @Get('popular')
  @ApiOperation({ summary: 'Popular movies' })
  @ApiQuery({ name: 'page', required: false, schema: { type: 'integer', minimum: 1, default: 1 } })
  @ApiOkResponse({ description: 'Popular movies page', type: MoviePageDto })
  async popular(@Query() q: PopularQueryDto): Promise<MoviePageDto> {
    const page = q.page ?? 1;

    const raw = await this.svc.getPopular(page);
    const items = raw.map(toMovieSummaryDto);

    const result: MoviePageDto = { page, items };
    return result;
  }
}
