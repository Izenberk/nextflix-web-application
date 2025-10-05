import { Controller, Get, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly svc: MoviesService) {}
  @Get('popular')
  async popular(@Query('page') page?: string) {
    const p = Number(page ?? 1);
    const items = await this.svc.getPopular(p);
    return { page: p, items };
  }
}
