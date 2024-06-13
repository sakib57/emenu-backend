import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { CategoryDocument } from 'src/category/schemas/category.schema';
import { MediaSchema, MediaDocument } from '../../common/schemas';
import { RestaurantDocument } from '../../restaurant/schemas';

export type MenuDocument = Menu & Document;
type AddonWithPriceDocument = AddonWithPrice & Document;

@Schema()
class AddonWithPrice {
  @Prop()
  item: string;

  @Prop()
  price: number;
}

const AddonWithPriceSchema = SchemaFactory.createForClass(AddonWithPrice);

@Schema({
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class Menu {
  @Prop({
    minlength: 2,
    maxlength: 150,
  })
  item: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  ingredients: string[];

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Restaurant',
    required: true,
  })
  restaurant: RestaurantDocument;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: CategoryDocument;

  @Prop({
    minlength: 3,
    maxlength: 5000,
  })
  description: string;

  @Prop()
  allergy: string[];

  @Prop({
    type: [AddonWithPriceSchema],
    required: true,
  })
  addOns: AddonWithPriceDocument[];

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
  ratings: number;

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

export const MenuSchema = SchemaFactory.createForClass(Menu);

MenuSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    return {
      _id: ret._id,
      item: ret.item,
      price: ret.price,
      ingredients: ret.ingredients,
      addOns: ret.addOns,
      allergy: ret.allergy,
      restaurant: ret.restaurant,
      category: ret.category,
      description: ret.description,
      thumbnail: ret.thumbnail,
      pictures: ret.pictures,
      videos: ret.videos,
      ratings: ret.ratings,
      isActive: ret.isActive,
      isDeleted: ret.isDeleted,
      cTime: ret.cTime,
    };
  },
});
