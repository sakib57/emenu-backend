import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PrinterType } from '../../common/mock/constant.mock';
import {
  LocationDocument,
  LocationSchema,
  MediaSchema,
  MediaDocument,
  MobileDocument,
  MobileSchema,
  SocialDocument,
  SocialSchema,
} from '../../common/schemas';

export type RestaurantDocument = Restaurant & Document;

@Schema({
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class Restaurant {
  @Prop({
    minlength: 2,
    maxlength: 150,
  })
  name: string;

  @Prop({
    minlength: 3,
    maxlength: 170,
  })
  nameSlug: string;

  @Prop({
    unique: true,
    minlength: 3,
    maxlength: 10,
  })
  slug: string;

  @Prop({
    unique: true,
  })
  restaurantId: string;

  @Prop({
    minlength: 3,
    maxlength: 5000,
  })
  description: string;

  @Prop({
    type: LocationSchema,
  })
  location: LocationDocument;

  @Prop({
    minlength: 3,
    maxlength: 150,
  })
  tagLine: string;

  @Prop({
    type: MediaSchema,
  })
  thumbnail: MediaDocument;

  @Prop({
    type: [MediaSchema],
    default: undefined,
  })
  pictures: MediaDocument[];

  @Prop({
    type: [MediaSchema],
    default: undefined,
  })
  videos: MediaDocument[];

  @Prop()
  email: string;

  @Prop({
    type: MobileSchema,
  })
  mobile: MobileDocument;

  @Prop()
  website: string;

  @Prop({
    type: [SocialSchema],
    default: undefined,
  })
  socials: SocialDocument[];

  @Prop({ default: 2 })
  tableCount: number;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop()
  ratings: number;

  @Prop({ default: 0 })
  profilePercentage: number;

  @Prop({ default: 0 })
  serviceCharge: number;

  @Prop()
  stripeApiKey: string;

  @Prop()
  stripeApiSecret: string;

  @Prop()
  printerName: string;

  @Prop({ default: PrinterType.STAR })
  printerType: string;

  @Prop()
  printerInterface: string;

  @Prop({ default: 'SLOVENIA' })
  printerCharacterSet: string;

  @Prop({ default: '=' })
  printerLineCharacter: string;

  @Prop({ default: false })
  removeSpecialCharacters: boolean;

  @Prop({ default: false })
  isSubscribed: boolean;

  @Prop({ default: false })
  isAcceptPrePayment: boolean;

  @Prop({ default: true })
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

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

RestaurantSchema.virtual('employee', {
  ref: 'Employee',
  localField: '_id',
  foreignField: 'restaurant',
  options: { sort: { name: 1 } },
  match: { isActive: true, isDeleted: false },
});

RestaurantSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    return {
      _id: ret._id,
      name: ret.name,
      slug: ret.slug,
      restaurantId: ret.restaurantId,
      description: ret.description,
      location: ret.location,
      tagLine: ret.tagLine,
      thumbnail: ret.thumbnail,
      pictures: ret.pictures,
      videos: ret.videos,
      email: ret.email,
      mobile: ret.mobile,
      website: ret.website,
      socials: ret.socials,
      tableCount: ret.tableCount,
      viewCount: ret.viewCount,
      ratings: ret.ratings,
      profilePercentage: ret.profilePercentage,
      serviceCharge: ret.serviceCharge,
      stripeApiKey: ret.stripeApiKey,
      stripeApiSecret: ret.stripeApiSecret,
      printerName: ret.printerName,
      printerType: ret.printerType,
      printerInterface: ret.printerInterface,
      printerCharacterSet: ret.printerCharacterSet,
      printerLineCharacter: ret.printerLineCharacter,
      removeSpecialCharacters: ret.removeSpecialCharacters,
      isSubscribed: ret.isSubscribed,
      isAcceptPrePayment: ret.isAcceptPrePayment,
      isActive: ret.isActive,
      isDeleted: ret.isDeleted,
      isOrphan: ret.isOrphan,
      cTime: ret.cTime,
    };
  },
});
