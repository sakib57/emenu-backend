import { Module } from '@nestjs/common';
import { MenuController } from './controllers';
import { MenuService } from './services';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantSchema } from '../restaurant/schemas';
import { MenuSchema } from './schemas';
import { FilesService } from '../files/services/files.service';
import { AwsS3Service, LocalStorageService } from '../files/services';
import { DOSpaceService } from '../files/services/do-space.service';
import { DOSpaceServicerovider } from '../files/helper/do-space.helper';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Restaurant', schema: RestaurantSchema },
      { name: 'Menu', schema: MenuSchema },
    ]),
  ],
  controllers: [MenuController],
  providers: [
    MenuService,
    FilesService,
    LocalStorageService,
    AwsS3Service,
    DOSpaceService,
    DOSpaceServicerovider,
  ],
})
export class MenuModule {}
