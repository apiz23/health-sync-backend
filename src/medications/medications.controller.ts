import {
  Controller,
  Get,
  Query,
  Res,
  HttpException,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
import { MedicationsService } from './medications.service';

@Controller('medications')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @Get('calendar')
  async getCalendar(@Query('userId') userId: string, @Res() res: Response) {
    try {
      if (!userId) {
        throw new HttpException('User ID required', HttpStatus.BAD_REQUEST);
      }

      const icsUrl = await this.medicationsService.generateCalendar(userId);

      res.json({ url: icsUrl }); // Return the public .ics URL
    } catch (error) {
      console.error('Error in calendar endpoint:', error);
      throw new HttpException(
        'Failed to generate calendar',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getMedications(@Query('userId') userId: string) {
    try {
      if (!userId) {
        throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
      }

      const medications = await this.medicationsService.getMedications(userId);

      return {
        statusCode: 200,
        message: 'Medications fetched successfully',
        data: medications,
      };
    } catch (error) {
      console.error('Error fetching medications:', error);
      throw new HttpException(
        'Failed to fetch medications',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('addMedication')
  async addMedication(@Body() body: any) {
    try {
      const { userId, ...medicationData } = body;

      if (!userId) {
        throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
      }

      const newMedication = await this.medicationsService.createMedication({
        userId,
        ...medicationData,
      });

      return {
        statusCode: 201,
        message: 'Medication reminder added successfully',
        data: newMedication,
      };
    } catch (error) {
      console.error('Error adding medication:', error);
      throw new HttpException(
        'Failed to add medication reminder',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
