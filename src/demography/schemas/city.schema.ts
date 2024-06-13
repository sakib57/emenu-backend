import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { CountryDocument } from './country.schema';
import { StateDocument } from './state.schema';

export type CityDocument = City & Document;

@Schema({
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class City {
  @Prop({
    minlength: 3,
    maxlength: 80,
    required: true,
  })
  name: string;

  @Prop({
    unique: true,
    minlength: 3,
    maxlength: 80,
    required: true,
  })
  slug: string;

  @Prop({
    required: true,
  })
  areaCode: number;

  @Prop()
  lat: number;

  @Prop()
  lng: number;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'State',
    required: true,
  })
  state: StateDocument;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Country',
    required: true,
  })
  country: CountryDocument;

  @Prop({ default: false })
  isCapital: boolean;

  @Prop({ default: false })
  isStateCapital: boolean;

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

export const CitySchema = SchemaFactory.createForClass(City);

CitySchema.index({ name: 1, state: 1 }, { unique: true });

CitySchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    return {
      _id: ret._id,
      name: ret.name,
      slug: ret.slug,
      areaCode: ret.areaCode,
      lat: ret.lat,
      lng: ret.lng,
      state: ret.state,
      country: ret.country,
      isCapital: ret.isCapital,
      isStateCapital: ret.isStateCapital,
      isActive: ret.isActive,
      isDeleted: ret.isDeleted,
    };
  },
});
