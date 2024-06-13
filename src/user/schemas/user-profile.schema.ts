import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { UserDocument } from './user.schema';
import {
  LocationDocument,
  LocationSchema,
  MobileDocument,
  MobileSchema,
  SocialDocument,
  SocialSchema,
} from '../../common/schemas';

export type UserProfileDocument = UserProfile & Document;

@Schema()
export class UserProfile {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  user: UserDocument;

  @Prop({
    minlength: 3,
    maxlength: 30,
  })
  firstName: string;

  @Prop({
    minlength: 3,
    maxlength: 30,
  })
  middleName: string;

  @Prop({
    minlength: 3,
    maxlength: 30,
  })
  lastName: string;

  @Prop({
    minlength: 2,
    maxlength: 120,
  })
  bio: string;

  @Prop()
  dob: number;

  @Prop()
  gender: string;

  @Prop({
    type: MobileSchema,
  })
  mobile: MobileDocument;

  @Prop({
    type: LocationSchema,
  })
  location: LocationDocument;

  @Prop({
    type: [SocialSchema],
    default: undefined,
  })
  socials: SocialDocument[];

  @Prop()
  profilePic: string;

  @Prop({ default: 0 })
  profilePercentage: number;

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

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);

UserProfileSchema.set('toJSON', {
  transform: function (doc, ret) {
    return {
      _id: ret._id,
      user: ret.user,
      firstName: ret.firstName,
      middleName: ret.middleName,
      lastName: ret.lastName,
      bio: ret.bio,
      dob: ret.dob,
      gender: ret.gender,
      mobile: ret.mobile,
      location: ret.location,
      socials: ret.socials,
      profilePic: ret.profilePic,
      profilePercentage: ret.profilePercentage,
      isActive: ret.isActive,
      isDeleted: ret.isDeleted,
    };
  },
});
