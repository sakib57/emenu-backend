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
  UseInterceptors,
  UploadedFiles,
  HttpStatus,
  HttpException,
  MethodNotAllowedException,
  Query,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { IUser } from '../../user/interfaces';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { NullValidationPipe } from '../../common/pipes/null-validator.pipe';
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
import { MenuService } from '../services';
import { CreateMenuDTO, UpdateMenuDTO, SearchMenuDTO } from '../dto';
import { FileUploadDTO } from '../../common/dto';
import { IPaginateMenu, IMenu } from '../interfaces';

/**
 * Menu Controller
 */
@ApiTags('Menu')
@ApiResponse({
  status: HttpStatus.METHOD_NOT_ALLOWED,
  description: 'Method not allowed',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('menu')
export class MenuController {
  /**
   * Constructor
   * @param {MenuService} menuService
   */
  constructor(private readonly menuService: MenuService) {}

  /**
   * Create menu
   * @param {IUser} user
   * @param {CreateMenuDTO} cMenuDTO
   * @returns {Promise<IMenu>}
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'Menu Creation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return menu.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_ACCEPTABLE,
    description: 'Record already exist',
  })
  @UsePipes(new NullValidationPipe())
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  @UseGuards(JwtAuthGuard)
  @Post('add')
  public async create(
    @User() user: IUser,
    @Body() cMenuDTO: CreateMenuDTO,
  ): Promise<IMenu> {
    try {
      return await this.menuService.create(user, cMenuDTO);
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
   * update menu
   * @Param {string} id
   * @Body {UpdateMenuDTO} uMenuDTO
   * @Param {IUser} user
   * @returns {Promise<IMenu>}
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'Update menu' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return updated restaurant.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Menu not found',
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
    @Body() uMenuDTO: UpdateMenuDTO,
    @UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      pictures?: Express.Multer.File[];
      videos?: Express.Multer.File[];
    },
    @User() user: IUser,
  ): Promise<IMenu> {
    try {
      return this.menuService.update(id, uMenuDTO, files, user);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'Update menu' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return updated menu.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Menu not found',
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
    @Body() uMenuDTO: UpdateMenuDTO,
    @User() user: IUser,
  ): Promise<IMenu> {
    try {
      return this.menuService.update(id, uMenuDTO, null, user);
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
   * find all restaurant
   * @returns {Promise<IPaginateRestaurant>}
   */
  @ApiOperation({ summary: 'Get all menus' })
  @UsePipes(new ValidationPipe(true))
  @Get('list')
  public findAll(@Query() query: SearchMenuDTO): Promise<IPaginateMenu> {
    try {
      return this.menuService.findAll(query);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
  @ApiExcludeEndpoint()
  @Post('list')
  public findAllPost() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Put('list')
  public findAllPut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Patch('list')
  public findAllPatch() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete('list')
  public findAllDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  /**
   * count menu
   * @returns {Promise<number>}
   */
  @ApiOperation({ summary: 'Count order' })
  @UsePipes(new ValidationPipe(true))
  @UseGuards(JwtAuthGuard)
  @Get('count')
  public count(@Query() query: SearchMenuDTO): Promise<number> {
    try {
      return this.menuService.count(query);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
  @ApiExcludeEndpoint()
  @Post('count')
  public countPost() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Put('count')
  public countPut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Patch('count')
  public countPatch() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete('count')
  public countDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }
}
