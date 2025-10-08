import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(@Res() res: Response) {
    return res.redirect('/docs');
  }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('healthz')
  health() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
