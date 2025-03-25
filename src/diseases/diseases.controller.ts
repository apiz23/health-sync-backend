import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DiseasesService } from './diseases.service';

@Controller('diseases')
export class DiseasesController {
  constructor(private readonly diseasesService: DiseasesService) {}

  @Get()
  async getUserDiseases(@Query('userId') userId: string) {
    if (!userId) {
      return { message: 'User ID is required' };
    }
    return this.diseasesService.findByUserId(userId);
  }

  @Post()
  async addDisease(
    @Body('userId') userId: string,
    @Body('name') name: string,
    @Body('category') category: string,
    @Body('description') description?: string,
  ) {
    if (!userId || !name || !category) {
      return { message: 'User ID, Name, and Category are required fields.' };
    }
    return this.diseasesService.addDisease(userId, name, category, description);
  }
}
