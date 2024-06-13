import { Module } from '@nestjs/common';
import { OrderController } from './controllers';
import { OrderService } from './services';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantSchema } from '../restaurant/schemas';
import { OrderSchema } from './schemas';
import { MenuSchema } from '../menu/schemas';
import { DOSpaceServicerovider } from 'src/files/helper/do-space.helper';
import { LocalStorageService, AwsS3Service } from 'src/files/services';
import { DOSpaceService } from 'src/files/services/do-space.service';
import { FilesService } from 'src/files/services/files.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Restaurant', schema: RestaurantSchema },
      { name: 'Order', schema: OrderSchema },
      { name: 'Menu', schema: MenuSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    FilesService,
    LocalStorageService,
    AwsS3Service,
    DOSpaceService,
    DOSpaceServicerovider,
  ],
})
export class OrderModule {}
