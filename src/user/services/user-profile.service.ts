import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser, IUserProfile } from '../interfaces';
import {
  CreateUserProfileDTO,
  UpdateUserProfileDTO,
  UserDTO,
  UserProfileDto,
} from '../dto';
import { FilesService } from '../../files/services/files.service';
import { IPaginateUser } from '../interfaces/paginate.interface';
import { SearchUserDTO } from '../dto/profile/search-user.dto';

@Injectable()
export class UserProfileService {
  private AWS_SERVICE_IMG_FOLDER = 'UserProfileImage';
  /**
   * Constructor
   * @param {Model<IUserProfile>} userProfileModel
   * @param {FilesService} filesService
   */
  constructor(
    @InjectModel('UserProfile')
    private readonly userProfileModel: Model<IUserProfile>,
    @InjectModel('User')
    private readonly userModel: Model<IUser>,
    private readonly filesService: FilesService,
  ) {}

  /**
   * Create a user profile
   * @param {IUser} user
   * @param {CreateUserProfileDTO} createUserProfileDTO
   * @returns {Promise<IUserProfile>}
   */
  create(
    user: IUser,
    createUserProfileDTO: CreateUserProfileDTO,
  ): Promise<IUserProfile> {
    try {
      const userProfileDTO = new UserProfileDto();
      userProfileDTO.user = user._id;
      userProfileDTO.cBy = user._id;
      const setUserProfile = { ...userProfileDTO, ...createUserProfileDTO };
      const registerDoc = new this.userProfileModel(setUserProfile);
      return registerDoc.save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Edit profile data by user
   * @param {IUser} user
   * @param {UpdateUserProfileDTO} updateUserProfileDto
   * @param files
   * @returns {Promise<IUser>} mutated user data
   */
  async update(
    user: IUser,
    updateUserProfileDto: UpdateUserProfileDTO,
    files: {
      proPic?: Express.Multer.File[];
    },
  ) {
    try {
      const userProfile = await this.userProfileModel.findOne({
        user: user._id,
      });
      if (!userProfile) {
        return Promise.reject(new NotFoundException('User not found.'));
      }
      const userDTO = new UserDTO();

      if (files) {
        if (files && files.proPic) {
          const uploadRes = await this.filesService.upload(files.proPic[0]);
          userDTO.profilePic = uploadRes.Location;
        }
      }
      userDTO.uTime = Date.now();
      const setUser = { ...updateUserProfileDto, ...userDTO };

      return await userProfile.set(setUser).save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  async updateById(
    user: IUser,
    id: string,
    updateUserProfileDto: UpdateUserProfileDTO,
  ) {
    try {
      if (
        updateUserProfileDto &&
        updateUserProfileDto?.hasOwnProperty('isAdmin')
      ) {
        if (!user.isSuperAdmin) {
          throw new ForbiddenException(
            'Only super admin can modify this fileds',
          );
        }
        return this.updateUser(id, updateUserProfileDto);
      }

      if (
        updateUserProfileDto &&
        (updateUserProfileDto?.hasOwnProperty('isActive') ||
          updateUserProfileDto?.hasOwnProperty('isVerified') ||
          updateUserProfileDto?.hasOwnProperty('isDeleted'))
      ) {
        if (!(user.isSuperAdmin || user.isAdmin)) {
          throw new ForbiddenException(
            'Only super admin or admin can modify this fileds',
          );
        }
        return this.updateUser(id, updateUserProfileDto);
      }
      return this.updateUser(id, updateUserProfileDto);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  async updateUser(id: string, updateUserProfileDto: UpdateUserProfileDTO) {
    const userProfile = await this.userProfileModel.findOne({
      user: id,
    });

    const user = await this.userModel.findOne({
      _id: id,
    });

    console.log(userProfile);
    if (!userProfile || !user) {
      return Promise.reject(new NotFoundException('User not found.'));
    }
    const userDTO = new UserDTO();
    userDTO.uTime = Date.now();
    const setUser = { ...updateUserProfileDto, ...userDTO };
    return await user
      .set(setUser)
      .save()
      .then(async () => {
        return await userProfile.set(setUser).save();
      });
  }

  async findAll(query: SearchUserDTO) {
    try {
      const userList = await this.userModel
        .find(query)
        .populate({ path: 'profile', model: 'UserProfile' });

      const result: IPaginateUser = {
        data: {
          users: await userList,
        },
      };
      return await result;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
