import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { CountryDocument } from '../../demography/schemas/country.schema';
import { StateDocument } from '../../demography/schemas/state.schema';
import { CityDocument } from '../../demography/schemas/city.schema';

export type LocationDocument = Location & Document;

@Schema()
export class Location {
  @Prop({
    maxlength: 300,
  })
  address: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'City',
  })
  city: CityDocument;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'State',
  })
  state: StateDocument;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Country',
  })
  country: CountryDocument;

  @Prop()
  zipCode: string;

  @Prop()
  lat: number;

  @Prop()
  lng: number;

  @Prop({
    enum: ['Point'],
    required: true,
    default: 'Point',
  })
  type: string;

  @Prop({
    required: false,
    index: '2dsphere',
  })
  coordinates: number[];

  @Prop({ default: false })
  isDeleted: boolean;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
