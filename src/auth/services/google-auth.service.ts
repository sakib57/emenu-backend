import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO } from '../../user/dto';
import { IUser } from '../../user/interfaces';
import { UsersService } from '../../user/services';
import { SocialAuthDTO } from '../dto/social-auth.dto';

@Injectable()
export class GoogleAuthService {
  /**
   * Constructor
   * @param {Model<IUser>} userModel
   * @param {JwtService} jwtService
   * @param {UsersService} usersService
   */
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Fetches a user from database by mongoId
   * @param {SocialAuthDTO} loginDto
   * @returns {Promise<IUser>} queried user data
   */
  private async validate(loginDto: SocialAuthDTO): Promise<IUser> {
    try {
      const email = loginDto.username.toLowerCase();

      return await this.userModel
        .findOne({ email: email })
        .populate('profile')
        .exec();
    } catch (error) {
      return;
    }
  }

  /**
   * Create a JWT-Token for authentication and return user data
   * @param {SocialAuthDTO} loginDto
   * @returns Promise<any | { status: number; message: string } queried user data
   */
  public async login(
    loginDto: SocialAuthDTO,
  ): Promise<any | { status: number; message: string }> {
    return this.validate(loginDto).then(async (userData) => {
      if (!userData) {
        const userDTO = new CreateUserDTO();
        userDTO.email = loginDto.username.toLowerCase();
        userDTO.password = Math.random().toString(36).slice(-8);
        userDTO.firstName = loginDto.name;
        const newUser = await this.usersService.register(userDTO);
        return this.completeLogin(newUser);
      }

      if (userData.isDeleted) {
        throw new ForbiddenException('User is deleted');
      }

      if (!userData.isActive) {
        throw new ForbiddenException('User account is on hold');
      }

      return this.completeLogin(userData);
    });
  }

  /**
   * Complete login functionality
   * @param {IUser} userData
   * @returns Promise<any | { status: number; message: string } queried user data
   */
  private completeLogin(userData: IUser) {
    const userProfile = userData.profile;

    const payload = {
      _id: userData._id,
      email: userData.email,
      isVerified: userData.isVerified,
      isSuperAdmin: userData.isSuperAdmin,
      isAdmin: userData.isAdmin,
      firstName: userProfile && userProfile.firstName,
      middleName: userProfile && userProfile.middleName,
      lastName: userProfile && userProfile.lastName,
      profilePercentage: userProfile && userProfile.profilePercentage,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      expiresIn: 7 * 24 * 60 * 60 * 1000,
      token: accessToken,
      user: payload,
      status: HttpStatus.OK,
    };
  }
}
