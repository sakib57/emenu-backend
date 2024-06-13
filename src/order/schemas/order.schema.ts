import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { LocationSchema, LocationDocument } from '../../common/schemas';
import { EmployeeDocument, RestaurantDocument } from '../../restaurant/schemas';
import {
  OrderType,
  OrderStatus,
  PaymentStatus,
} from '../../common/mock/constant.mock';
import { MenuDocument } from '../../menu/schemas';
import { UserDocument } from '../../user/schemas/user.schema';

export type OrderDocument = Order & Document;
type ItemWithQuantityDocument = ItemWithQuantity & Document;

@Schema()
class ItemWithQuantity {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Menu',
    required: true,
  })
  item: MenuDocument;

  @Prop()
  itemPrice: number;

  @Prop()
  quantity: number;

  @Prop()
  addons: string[];

  @Prop()
  removes: string[];
}

export const ItemWithQuantitySchema =
  SchemaFactory.createForClass(ItemWithQuantity);

@Schema({
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class Order {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Restaurant',
    required: true,
  })
  restaurant: RestaurantDocument;

  @Prop({
    type: [ItemWithQuantitySchema],
    required: true,
  })
  items: ItemWithQuantityDocument[];

  @Prop({
    unique: true,
  })
  orderId: string;

  @Prop()
  invoice: string;

  @Prop({ default: OrderType.IN_HOUSE })
  orderType: string;

  @Prop({ default: Date.now() })
  orderDate: number;

  @Prop()
  tableNumber: number;

  @Prop({
    type: LocationSchema,
  })
  location: LocationDocument;

  @Prop({ default: OrderStatus.PENDING })
  status: string;

  @Prop({
    required: true,
  })
  subTotal: number;

  @Prop()
  serviceCharge: number;

  @Prop({
    required: true,
  })
  grandTotal: number;

  @Prop({ default: PaymentStatus.PENDING })
  paymentStatus: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Employee',
  })
  servedBy: EmployeeDocument;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
  })
  orderBy: UserDocument;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: Date.now() })
  cTime: number;

  @Prop()
  cBy: string;

  @Prop({ default: Date.now() })
  uTime: number;

  @Prop()
  uBy: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
