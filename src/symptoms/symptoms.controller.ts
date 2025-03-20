import { Controller, Post, Get, Body, Req, Param } from '@nestjs/common';
import { SymptomsService } from './symptoms.service';

@Controller('symptoms')
export class SymptomsController {
  constructor(private readonly symptomsService: SymptomsService) {}

  @Get(':userId')
  async getUserSymptoms(@Param('userId') userId: string) {
    return this.symptomsService.getUserSymptoms(userId);
  }

  @Post()
  async addSymptom(@Req() req, @Body('description') description: string) {
    return this.symptomsService.addSymptom(req.user.id, description);
  }

  @Get()
  async getSymptoms(@Req() req) {
    return this.symptomsService.getUserSymptoms(req.user.id);
  }
}
