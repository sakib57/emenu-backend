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
  Logger,
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
} from '@nestjs/swagger';
import { StateService } from '../services';
import { CreateStateDTO } from '../dto/state/create-state.dto';
import { UpdateStateDTO } from '../dto/state/update-state.dto';
import { IState } from '../interfaces';
import { StateSearchQueryDTO } from '../dto/state/state-search-query.dto';
import { IPaginatedState } from '../interfaces';

/**
 * State Controller
 */
@ApiTags('Demography')
@ApiResponse({
  status: HttpStatus.METHOD_NOT_ALLOWED,
  description: 'Method not allowed',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('state')
export class StateController {
  private readonly logger = new Logger(StateController.name);

  /**
   * Constructor
   * @param {StateService} stateService
   */
  constructor(private readonly stateService: StateService) {}

  /**
   * Create state
   * @param {IUser} user
   * @param {CreateStateDTO} createStateDTO
   * @returns {Promise<IState>}
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'state Creation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return new state.',
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
  public async create(
    @User() user: IUser,
    @Body() createStateDTO: CreateStateDTO,
  ): Promise<IState> {
    try {
      return await this.stateService.create(user, createStateDTO);
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
   * update state
   * @Param {string} id
   * @Body {UpdateStateDTO} updateStateDTO
   * @Param {IUser} user
   * @returns {Promise<IState>}
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'state update' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return updated state.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'State not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  public async update(
    @Param('id') id: string,
    @Body() updateStateDTO: UpdateStateDTO,
  ): Promise<IState> {
    try {
      return this.stateService.update(id, updateStateDTO);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @ApiExcludeEndpoint()
  @Get('update/:id')
  public updateThemeGet() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Put('update/:id')
  public updateThemePut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Post('update/:id')
  public updateThemePost() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete('update/:id')
  public updateThemeDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  /**
   * Find states
   * @Query {Object} query
   * @returns {Promise<IState[]>}
   */
  @ApiOperation({ summary: 'Get states' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'This is public api. Return states.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No token is received or token expire',
  })
  @Get('list')
  @UsePipes(new ValidationPipe(true))
  findAll(@Query() query: StateSearchQueryDTO): Promise<IPaginatedState> {
    try {
      return this.stateService.findAll(query);
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
}
