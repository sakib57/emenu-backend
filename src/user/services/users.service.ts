import {
  Injectable,
  HttpStatus,
  HttpException,
  BadRequestException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserProfileService } from './user-profile.service';
import { CreateUserDTO, UserDTO, CreateUserProfileDTO } from '../dto';
import { encodeToken, decodeToken } from '../../common/utils/helper';
import { IUser } from '../interfaces';

/**
 * User Service
 */
@Injectable()
export class UsersService {
  private readonly password = 'oS1H+dKX1+OkXUu3jABIKqThi5/BJJtB0OCo';
  /**
   * Constructor
   * @param {Model<IUser>} userModel
   * @param {Service<UserProfileService>} profileService
   */
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<IUser>,
    private readonly profileService: UserProfileService,
  ) { }

  /**
   * Create a user with RegisterPayload fields
   * @param {CreateUserDTO} createUserDTO user payload
   * @returns {Promise<IUser>} created user data
   */
  async register(createUserDTO: CreateUserDTO): Promise<IUser> {
    try {
      const userDTO = new UserDTO();
      userDTO.email = createUserDTO.email.toLowerCase();
      const isUserExist = await this.userModel.findOne({
        email: userDTO.email,
      });
      if (isUserExist) {
        return Promise.reject(
          new NotAcceptableException(
            `User already exist with the ${userDTO.email}`,
          ),
        );
      }
      userDTO.password = bcrypt.hashSync(createUserDTO.password, 8);
      userDTO.isMerchant = createUserDTO.isMerchant || false;
      userDTO.otp = Math.round(1000 + Math.random() * 9000);
      userDTO.otpExpiresAt = Date.now() + 15 * 60 * 1000;

      const registerModel = new this.userModel(userDTO);
      const newUser = await registerModel.save();

      const token = {
        _id: newUser._id,
        email: userDTO.email,
      };
      const updateDTO = new UserDTO();
      updateDTO.emailProofToken = await encodeToken(token, this.password);
      updateDTO.emailProofTokenExpiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes
      updateDTO.cBy = newUser._id;
      updateDTO.uBy = newUser._id;
      updateDTO.uTime = Date.now();
      await newUser.set(updateDTO).save();

      const userProfileDTO = new CreateUserProfileDTO();
      if (createUserDTO && createUserDTO.hasOwnProperty('firstName')) {
        userProfileDTO.firstName =
          createUserDTO.hasOwnProperty('firstName') && createUserDTO.firstName;
      }
      if (createUserDTO && createUserDTO.hasOwnProperty('middleName')) {
        userProfileDTO.middleName =
          createUserDTO.hasOwnProperty('middleName') &&
          createUserDTO.middleName;
      }
      if (createUserDTO && createUserDTO.hasOwnProperty('lastName')) {
        userProfileDTO.lastName =
          createUserDTO.hasOwnProperty('lastName') && createUserDTO.lastName;
      }
      await this.profileService.create(newUser, userProfileDTO);
      return newUser;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Verify a user account with verification token
   * @param {string} token
   * @returns {Promise<IUser>} verify user account
   */
  async accountVerification(token: string): Promise<IUser> {
    try {
      const decryptedJson = await decodeToken(token, this.password);
      const user = await this.userModel.findById(decryptedJson._id);
      if (!user) {
        return Promise.reject(new NotFoundException('Could not find user.'));
      }

      if (user && user.get('emailProofTokenExpiresAt')) {
        const now = Date.now();

        if (user.get('emailProofTokenExpiresAt') < now) {
          return Promise.reject(new BadRequestException('Token is expire!'));
        } else if (user.get('emailProofToken') !== token) {
          return Promise.reject(new BadRequestException('Invalid Token!'));
        } else {
          await user
            .set({
              isVerified: true,
            })
            .save();
        }
      } else {
        return Promise.reject(
          new UnauthorizedException('No token is received!'),
        );
      }
      return user;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * generate new verification token
   * @param {string} email
   * @param {string} oldToken
   * @returns {Promise<Record<any, any>>}
   */
  async generateToken(
    email: string,
    oldToken: string,
  ): Promise<Record<any, any>> {
    try {
      if (!email && oldToken) {
        const decryptToken = await decodeToken(oldToken, this.password);
        email = decryptToken.email;
      }
      const user = await this.userModel.findOne({ email });

      if (!user) {
        return Promise.reject(new NotFoundException('Could not find user.'));
      }

      const resetMinutes = 15;

      if (
        user.emailProofTokenExpiresAt >
        Date.now() + (resetMinutes - 1) * 60 * 1000
      )
        return Promise.reject(
          new BadRequestException('You can generate token after 1 minute'),
        );

      const token = {
        _id: user._id,
        email: user.email,
      };
      const updateDTO = new UserDTO();
      updateDTO.emailProofToken = await encodeToken(token, this.password);
      updateDTO.emailProofTokenExpiresAt =
        Date.now() + resetMinutes * 60 * 1000;
      updateDTO.uBy = user._id;
      updateDTO.uTime = Date.now();
      await user.set(updateDTO).save();
      return { data: '', message: 'Token Generated Successfully !' };
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * generate password reset token
   * @param {string} email
   * @returns {Promise<object>}
   */
  async generatePasswordResetToken(email: string): Promise<Record<any, any>> {
    try {
      const userEmail = email.toLowerCase();
      const user = await this.userModel.findOne({ email: userEmail });

      if (!user) {
        return Promise.reject(new NotFoundException('User not found.'));
      }

      const resetMinutes = 15;

      if (
        user.passwordResetTokenExpiresAt >
        Date.now() + (resetMinutes - 1) * 60 * 1000
      )
        return Promise.reject(
          new BadRequestException('You can generate token after 1 minute'),
        );

      const token = {
        _id: user._id,
        email: user.email,
      };
      const updateDTO = new UserDTO();
      updateDTO.passwordResetToken = await encodeToken(token, this.password);
      updateDTO.passwordResetTokenExpiresAt =
        Date.now() + resetMinutes * 60 * 1000; // 15 minutes
      updateDTO.uBy = user._id;
      await user.set(updateDTO).save();
      return { data: '', message: 'Token Generated Successfully !' };
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * reset user password using token
   * @returns {Promise<object>}
   * @param {string} token
   * @param {string} newPassword
   */
  public async forgetPassword(
    token: string,
    newPassword: string,
  ): Promise<any> {
    try {
      const decryptedJson = await decodeToken(token, this.password);
      const user = await this.userModel.findById(decryptedJson._id);
      if (!user) {
        return Promise.reject(new NotFoundException('User not found.'));
      }

      if (user && user.get('passwordResetTokenExpiresAt')) {
        const now = Date.now();

        if (user.get('passwordResetTokenExpiresAt') < now) {
          return Promise.reject(new BadRequestException('Token is expire!'));
        } else if (user.get('passwordResetToken') !== token) {
          return Promise.reject(new BadRequestException('Invalid Token!'));
        } else {
          const passwordIsValid = bcrypt.compareSync(
            newPassword,
            user.password,
          );

          if (passwordIsValid) {
            return Promise.reject(
              new BadRequestException('Already used this password'),
            );
          } else {
            return await user
              .set({
                password: bcrypt.hashSync(newPassword, 8),
                uBy: decryptedJson._id,
                passwordResetTokenExpiresAt:
                  Date.now() - 365 * 24 * 60 * 60 * 1000,
              })
              .save();
          }
        }
      } else {
        return Promise.reject(new BadRequestException('Token is not found!'));
      }
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * reset user password using token
   * @param {string} id
   * @param {string} currentPassword
   * @param {string} newPassword
   * @returns {Promise<object>}
   */
  public async resetPassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<any> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        return Promise.reject(new NotFoundException('Could not find user.'));
      }

      if (user && user.get('password')) {
        const passwordIsValid = bcrypt.compareSync(
          currentPassword,
          user.password,
        );

        const passwordIsSame = currentPassword === newPassword;

        if (!passwordIsValid) {
          return Promise.reject(
            new BadRequestException('Current password is not matched'),
          );
        } else if (passwordIsSame) {
          return Promise.reject(
            new BadRequestException('Already used this password'),
          );
        } else {
          return await user
            .set({
              password: bcrypt.hashSync(newPassword, 8),
              uBy: user._id,
            })
            .save();
        }
      } else {
        return Promise.reject(
          new BadRequestException('User information is not found'),
        );
      }
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Find user by id
   * @param { string } id
   * @returns {Promise<IUser>} mutated user data
   */
  async findById(id: string): Promise<IUser> {
    try {
      const userProfile = await this.userModel
        .findOne({
          _id: id,
        })
        .populate('profile')
        .exec();

      if (!userProfile) {
        return Promise.reject(new NotFoundException('User not found.'));
      }
      return userProfile;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
