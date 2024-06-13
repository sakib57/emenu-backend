import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UsePipes,
  HttpStatus,
  HttpException,
  MethodNotAllowedException,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { IUser } from '../../user/interfaces';
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
  ApiExcludeEndpoint,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { CategoryService } from '../services/category.service';
import {
  CreateCategoryDTO,
  SearchCategoryDTO,
  UpdateCategoryDTO,
} from '../dto';
import { ICategory, IPaginateCategory } from '../interfaces';
import { NullValidationPipe } from '../../common/pipes/null-validator.pipe';
import { FileUploadDTO } from '../../common/dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

/**
 * Category Controller
 */
@ApiTags('Category')
@ApiResponse({
  status: HttpStatus.METHOD_NOT_ALLOWED,
  description: 'Method not allowed',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('category')
export class CategoryController {
  /**
   * Constructor
   * @param {CategoryService} categoryService
   */
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * Categories
   * @Body {CreateCategoryDTO} cCategoryDTO
   * @User user: IUser
   * @returns {Promise<ICategory>}
   */
  @ApiOperation({ summary: 'Category creation' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return category.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_ACCEPTABLE,
    description: 'Record already exist',
  })
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  @UseGuards(JwtAuthGuard)
  @Post('add')
  create(
    @User() user: IUser,
    @Body() cCategoryDTO: CreateCategoryDTO,
  ): Promise<ICategory> {
    try {
      return this.categoryService.create(user, cCategoryDTO);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
  @ApiExcludeEndpoint()
  @Get('add')
  public createGet() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Put('add')
  public createPut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Patch('add')
  public createPatch() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete('add')
  public createDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  /**
   * Edit category
   * @param {string} id
   * @param {UpdateCategoryDTO} uCategoryDTO
   * @param {IUser} user
   * @returns {Promise<ICategory>}
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return updated category.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDTO })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },
      { name: 'pictures', maxCount: 8 },
      { name: 'videos', maxCount: 3 },
    ]),
  )
  @Put('update/:id')
  public async update(
    @Param('id') id: string,
    @Body() uCategoryDTO: UpdateCategoryDTO,
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      pictures?: Express.Multer.File[];
      videos?: Express.Multer.File[];
    },
    @User() user: IUser,
  ): Promise<ICategory> {
    try {
      return this.categoryService.update(id, user, files, uCategoryDTO);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return updated category.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
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
  public updatePatch(
    @Param('id') id: string,
    @Body() uCategoryDTO: UpdateCategoryDTO,
    @User() user: IUser,
  ): Promise<ICategory> {
    try {
      return this.categoryService.update(id, user, null, uCategoryDTO);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
  @ApiExcludeEndpoint()
  @Get('update/:id')
  public updateGet() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Post('update/:id')
  public updatePost() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete('update/:id')
  public updateDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  /**
   * Fetches all category
   * @returns {Promise<IPaginateCategory} queried user data
   */
  @ApiOperation({ summary: 'Fetches all category' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'This is private api. Fetches all category.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No token is received or token expire',
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @Get('list')
  @UsePipes(new ValidationPipe(true))
  findAllCategory(
    @Query() query: SearchCategoryDTO,
  ): Promise<IPaginateCategory> {
    try {
      return this.categoryService.findAllCategory(query);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
  @ApiExcludeEndpoint()
  @Post('list')
  public findAllCategoryPost() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Put('list')
  public findAllCategoryPut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Patch('list')
  public findAllCategoryPatch() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete('list')
  public findAllCategoryDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }
}
