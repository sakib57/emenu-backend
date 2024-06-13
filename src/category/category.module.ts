import { Module } from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { CategorySchema } from './schemas/category.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantSchema } from '../restaurant/schemas';
import { UserSchema } from '../user/schemas/user.schema';
import { FilesService } from '../files/services/files.service';
import { AwsS3Service, LocalStorageService } from '../files/services';
import { DOSpaceService } from '../files/services/do-space.service';
import { DOSpaceServicerovider } from '../files/helper/do-space.helper';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Restaurant', schema: RestaurantSchema },
      { name: 'Category', schema: CategorySchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  providers: [
    CategoryService,
    FilesService,
    LocalStorageService,
    AwsS3Service,
    DOSpaceService,
    DOSpaceServicerovider,
  ],
  controllers: [CategoryController],
})
export class CategoryModule {}
