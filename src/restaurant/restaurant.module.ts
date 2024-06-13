import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeService, RestaurantService } from './services';
import { EmployeeSchema, RestaurantSchema } from './schemas';
import { RestaurantController, EmployeeController } from './controllers';
import { UserSchema } from '../user/schemas/user.schema';
import { FilesService } from '../files/services/files.service';
import { AwsS3Service, LocalStorageService } from '../files/services';
import { DOSpaceService } from '../files/services/do-space.service';
import { DOSpaceServicerovider } from '../files/helper/do-space.helper';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Restaurant', schema: RestaurantSchema },
      { name: 'Employee', schema: EmployeeSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [RestaurantController, EmployeeController],
  providers: [
    RestaurantService,
    EmployeeService,
    DOSpaceService,
    FilesService,
    LocalStorageService,
    AwsS3Service,
    DOSpaceServicerovider,
  ],
})
export class RestaurantModule {}
