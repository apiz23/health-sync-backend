import { Controller, Get, Param } from '@nestjs/common';
import { DiseasesService } from './diseases.service';

@Controller('diseases')
export class DiseasesController {
  constructor(private readonly diseasesService: DiseasesService) {}

  @Get(':userId')
  async getUserDiseases(@Param('userId') userId: string) {
    if (!userId) {
      return { message: 'User ID is required' };
    }
    return this.diseasesService.findByUserId(userId);
  }
}
