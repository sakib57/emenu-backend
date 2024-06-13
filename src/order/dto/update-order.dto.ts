import { IsMongoId, ValidateNested, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LocationDTO } from '../../common/dto';
import { Type } from 'class-transformer';
import { Location } from '../../common/schemas';
import {
  OrderStatus,
  OrderType,
  PaymentStatus,
} from '../../common/mock/constant.mock';

class ItemWithQuantityDTO {
  @ApiProperty()
  @IsMongoId()
  item: string;

  @ApiProperty()
  addons: string[];

  @ApiProperty()
  @IsArray()
  removes: string[];

  @ApiProperty()
  itemPrice: number;

  @ApiProperty()
  quantity: number;
}

export class UpdateOrderDTO implements Readonly<UpdateOrderDTO> {
  @ApiProperty({
    type: ItemWithQuantityDTO,
  })
  @ValidateNested({ each: true })
  @Type(() => ItemWithQuantityDTO)
  items: [ItemWithQuantityDTO];

  @ApiProperty({
    enum: OrderType,
  })
  @IsEnum(OrderType)
  orderType: OrderType;

  @ApiProperty({
    type: LocationDTO,
  })
  @Type(() => LocationDTO)
  location: Location;

  @ApiProperty({
    enum: OrderStatus,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty({
    enum: PaymentStatus,
  })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @ApiProperty()
  @IsMongoId()
  servedBy: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isDeleted: boolean;

  @ApiProperty()
  timezone: string;
}
