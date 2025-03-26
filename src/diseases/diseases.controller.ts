import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
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

  @Post('addDisease')
  async addDisease(@Body() body: any) {
    try {
      const { userId, name, category, description } = body;

      if (!userId || !name || !category) {
        throw new HttpException(
          'User ID, Name, and Category are required fields.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const newDisease = await this.diseasesService.addDisease(
        userId,
        name,
        category,
        description,
      );

      return {
        statusCode: 201,
        message: 'Disease added successfully',
        data: newDisease,
      };
    } catch (error) {
      console.error('Error adding disease:', error);
      throw new HttpException(
        'Failed to add disease',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
