import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserProfileService, UsersService } from './services';
import { UserSchema } from './schemas/user.schema';
import { UserProfileSchema } from './schemas/user-profile.schema';
import { UsersController } from './controllers';
import { UsersProfileController } from './controllers/user-profile.controller';
import { FilesService } from '../files/services/files.service';
import { AwsS3Service, LocalStorageService } from '../files/services';
import { DOSpaceService } from '../files/services/do-space.service';
import { DOSpaceServicerovider } from '../files/helper/do-space.helper';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'UserProfile', schema: UserProfileSchema },
    ]),
    JwtModule.register({
      secret: process.env.SECRET_KEY_JWT,
      signOptions: {
        expiresIn: 24 * 60 * 60 * 1000, // 1 days,
      },
    }),
  ],
  controllers: [UsersController, UsersProfileController],
  providers: [
    UsersService,
    UserProfileService,
    FilesService,
    LocalStorageService,
    AwsS3Service,
    DOSpaceService,
    DOSpaceServicerovider,
  ],
  exports: [UsersService],
})
export class UserModule {}
