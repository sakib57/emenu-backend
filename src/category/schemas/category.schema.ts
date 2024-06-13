import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { MediaDocument, MediaSchema } from '../../common/schemas';
import { RestaurantDocument } from '../../restaurant/schemas/restaurant.schema';

export type CategoryDocument = Category & Document;

@Schema()
export class Category {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Restaurant',
    required: true,
  })
  restaurant: RestaurantDocument;

  @Prop()
  name: string;

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

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    return {
      _id: ret._id,
      restaurant: ret.restaurant,
      name: ret.name,
      thumbnail: ret.thumbnail,
      pictures: ret.pictures,
      videos: ret.videos,
      isActive: ret.isActive,
      isDeleted: ret.isDeleted,
      cTime: ret.cTime,
    };
  },
});
