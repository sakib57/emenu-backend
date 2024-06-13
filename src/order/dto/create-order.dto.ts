import {
  IsMongoId,
  ValidateNested,
  IsEnum,
  IsOptional,
  IsArray,
  IsString,
} from 'class-validator';
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
  itemPrice: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  @IsArray()
  addons: string[];

  @ApiProperty()
  @IsArray()
  removes: string[];
}

export class CreateOrderDTO implements Readonly<CreateOrderDTO> {
  @ApiProperty()
  @IsMongoId()
  restaurant: string;

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

  @ApiProperty()
  invoice: string;

  @ApiProperty()
  orderDate: number;

  @ApiProperty()
  tableNumber: number;

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
  subTotal: number;

  @ApiProperty()
  serviceCharge: number;

  @ApiProperty()
  grandTotal: number;

  @ApiProperty({
    enum: PaymentStatus,
  })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @ApiProperty()
  @IsMongoId()
  @IsOptional()
  orderBy: string;

  @ApiProperty()
  timezone: string;
}
