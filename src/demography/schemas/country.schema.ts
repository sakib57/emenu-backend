import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CountryDocument = Country & Document;

@Schema({
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class Country {
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
    unique: true,
    sparse: true,
    minlength: 1,
    maxlength: 10,
    required: true,
  })
  code: string;

  @Prop([])
  languages: [];

  @Prop()
  dialingCode: string;

  @Prop()
  continent: string;

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

export const CountrySchema = SchemaFactory.createForClass(Country);

CountrySchema.virtual('states', {
  ref: 'State',
  localField: '_id',
  foreignField: 'country',
  options: { sort: { name: 1 } },
  match: { isActive: true, isDeleted: false },
});

CountrySchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    return {
      _id: ret._id,
      name: ret.name,
      code: ret.code,
      slug: ret.slug,
      languages: ret.languages,
      dialingCode: ret.dialingCode,
      states: ret.states,
      continent: ret.continent,
      isActive: ret.isActive,
      isDeleted: ret.isDeleted,
    };
  },
});
