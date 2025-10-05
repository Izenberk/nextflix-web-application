import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, IsNumber } from 'class-validator';

export class PopularQueryDto {
  @ApiPropertyOptional({
    description: 'Results page (1..n)',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  @Min(1)
  page?: number = 1;
}
