import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { UserDocument } from '../../user/schemas/user.schema';
import { RoleType, Status } from '../../common/mock/constant.mock';
import { RestaurantDocument } from './restaurant.schema';

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  })
  user: UserDocument;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Restaurant',
    required: true,
  })
  restaurant: RestaurantDocument;

  @Prop({ default: RoleType.WAITER })
  role: string;

  @Prop({ default: Status.INVITED })
  status: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: false })
  isBranchManager: boolean;

  @Prop({ default: false })
  isOwner: boolean;

  @Prop({ default: false })
  isPaid: boolean;

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

export const EmployeeSchema = SchemaFactory.createForClass(Employee);

EmployeeSchema.index({ user: 1, restaurant: 1 }, { unique: true });

