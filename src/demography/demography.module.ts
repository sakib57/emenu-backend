import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CountrySchema } from './schemas/country.schema';
import { StateSchema } from './schemas/state.schema';
import { CitySchema } from './schemas/city.schema';
import { CountryService, StateService } from './services';
import { CountryController, StateController } from './controllers';
import { CityService } from './services';
import { CityController } from './controllers/city.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Country', schema: CountrySchema },
      { name: 'State', schema: StateSchema },
      { name: 'City', schema: CitySchema },
    ]),
  ],
  controllers: [CountryController, StateController, CityController],
  providers: [CountryService, StateService, CityService],
})
export class DemographyModule {}
