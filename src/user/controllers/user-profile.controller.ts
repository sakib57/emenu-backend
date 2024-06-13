import {
  Controller,
  Patch,
  Body,
  UseGuards,
  UsePipes,
  HttpStatus,
  HttpException,
  Put,
  UploadedFiles,
  UseInterceptors,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { UserProfileService } from '../services';
import { UpdateUserProfileDTO } from '../dto';
import { IUser, IUserProfile } from '../interfaces';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { TrimPipe } from '../../common/pipes/trim.pipe';
import { User } from '../../common/decorators/user.decorator';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiHeader,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { NullValidationPipe } from '../../common/pipes/null-validator.pipe';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserProfileImageUploadDTO } from '../dto/profile/update-user-profile-image.dto';
import { SearchMenuDTO } from '../../menu/dto';
import { IPaginateUser } from '../interfaces/paginate.interface';

/**
 * User Controller
 */
@ApiTags('User')
@ApiResponse({
  status: HttpStatus.METHOD_NOT_ALLOWED,
  description: 'Method not allowed',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('user')
export class UsersProfileController {
  /**
   * Constructor
   * @param {UserProfileService} usersService
   */
  constructor(private readonly userProfileService: UserProfileService) {}

  /**
   * update user profile by user
   * @User {IUser} user
   * @Body {UserProfileDTO} UserProfileDTO
   * @returns {Promise<IUserProfile>} created user data
   */

  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'user update by user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return updated user.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UserProfileImageUploadDTO })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'proPic' }]))
  @Put('update')
  public async updateUserProfilePut(
    @User() user: IUser,
    @Body() updateUserProfileDTO: UpdateUserProfileDTO,
    @UploadedFiles()
    files: {
      proPic?: Express.Multer.File[];
    },
  ): Promise<IUserProfile> {
    try {
      return await this.userProfileService.update(
        user,
        updateUserProfileDTO,
        files,
      );
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'user update by user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return updated user.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @UsePipes(new NullValidationPipe())
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  @UseGuards(JwtAuthGuard)
  @Patch('update')
  public async updateUserProfile(
    @User() user: IUser,
    @Body() updateUserProfileDTO: UpdateUserProfileDTO,
  ): Promise<IUserProfile> {
    try {
      return await this.userProfileService.update(
        user,
        updateUserProfileDTO,
        null,
      );
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * update user profile
   * @User {IUser} user
   * @Body {UserProfileDTO} UserProfileDTO
   * @returns {Promise<IUserProfile>} created user data
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'user update from admin panel' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return updated user.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @UsePipes(new NullValidationPipe())
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  public async updateUserById(
    @User() user: IUser,
    @Param('id') id: string,
    @Body() updateUserProfileDTO: UpdateUserProfileDTO,
  ): Promise<IUserProfile> {
    try {
      return await this.userProfileService.updateById(
        user,
        id,
        updateUserProfileDTO,
      );
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * user list
   * @returns {Promise<IUserProfile[]>} user list
   */
  @ApiOperation({ summary: 'user list' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return user list.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @UsePipes(new ValidationPipe(true))
  @Get('list')
  public async findAll(@Query() query: SearchMenuDTO): Promise<IPaginateUser> {
    try {
      return await this.userProfileService.findAll(query);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
