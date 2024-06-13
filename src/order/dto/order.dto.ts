import {
  IsMongoId,
  ValidateNested,
  IsEnum,
  MaxLength,
  MinLength,
  IsString,
  IsArray,
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

export class OrderDTO implements Readonly<OrderDTO> {
  @ApiProperty()
  @IsMongoId()
  restaurant: string;

  @ApiProperty({
    type: ItemWithQuantityDTO,
  })
  @ValidateNested({ each: true })
  @Type(() => ItemWithQuantityDTO)
  items: [ItemWithQuantityDTO];

  @ApiProperty()
  @MaxLength(170)
  @MinLength(3)
  @IsString()
  orderId: string;

  @ApiProperty()
  invoice: string;

  @ApiProperty({
    enum: OrderType,
  })
  @IsEnum(OrderType)
  orderType: OrderType;

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
  servedBy: string;

  @ApiProperty()
  @IsMongoId()
  orderBy: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isDeleted: boolean;

  @ApiProperty()
  cTime: number;

  @ApiProperty()
  cBy: string;

  @ApiProperty()
  uTime: number;

  @ApiProperty()
  uBy: string;
}
