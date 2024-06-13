import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MediaType, MediaProvider } from '../mock/constant.mock';

const PROVIDER =
  process.env.NODE_ENV === 'production'
    ? MediaProvider.AWS_S3
    : MediaProvider.LOCAL;

export type MediaDocument = Media & Document;

@Schema()
export class Media {
  @Prop({
    minlength: 10,
    maxlength: 300,
  })
  uri: string;

  @Prop({
    minlength: 3,
    maxlength: 25,
  })
  mimetype: string;

  @Prop({ default: PROVIDER })
  provider: string;

  @Prop({ default: MediaType.IMAGE })
  type: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
