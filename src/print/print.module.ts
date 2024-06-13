import { Module } from '@nestjs/common';
import { ThermalPrintService } from './services';
import { ThermalPrintController } from './controllers';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from '../order/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
  ],
  providers: [ThermalPrintService],
  controllers: [ThermalPrintController],
})
export class PrintModule {}
