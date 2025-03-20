import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SymptomsModule } from './symptoms/symptoms.module';
import { DiseasesService } from './diseases/diseases.service';
import { DiseasesController } from './diseases/diseases.controller';
import { MedicationsService } from './medications/medications.service';
import { MedicationsController } from './medications/medications.controller';

@Module({
  imports: [SymptomsModule],
  controllers: [AppController, DiseasesController, MedicationsController],
  providers: [AppService, DiseasesService, MedicationsService],
})
export class AppModule {}
