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
import { EmployeeService } from '../services';
import {
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  SearchEmployeeDTO, SearchRestaurantDTO,
} from '../dto';
import { IEmployee, IPaginateEmployee } from '../interfaces';

/**
 * Restaurant employee Controller
 */
@ApiTags('Restaurant')
@ApiResponse({
  status: HttpStatus.METHOD_NOT_ALLOWED,
  description: 'Method not allowed',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller()
export class EmployeeController {
  /**
   * Constructor
   * @param {EmployeeService} employeeService
   */
  constructor(private readonly employeeService: EmployeeService) {}

  /**
   * Associate employee with restaurant
   * @Body {CreateEmployeeDTO} cEmployeeDTO
   * @User user: IUser
   * @returns {Promise<IEmployee>}
   */
  @ApiOperation({ summary: 'Associate employee with restaurant' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return association of employee with restaurant.',
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
  @Post('restaurant/employee/add')
  create(
    @User() user: IUser,
    @Body() cEmployeeDTO: CreateEmployeeDTO,
  ): Promise<IEmployee> {
    try {
      return this.employeeService.create(user, cEmployeeDTO);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @ApiExcludeEndpoint()
  @Get('restaurant/employee/add')
  public createGet() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Put('restaurant/employee/add')
  public createPut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Patch('restaurant/employee/add')
  public createPatch() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete('restaurant/employee/add')
  public createDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  /**
   * Edit the association of employee with restaurant
   * @param {string} id
   * @param {UpdateEmployeeDTO} uEmployeeDTO
   * @param {IUser} user
   * @returns {Promise<IEmployee>}
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({
    summary: 'Edit the association of employee with restaurant',
  })
  @ApiOperation({
    summary: 'Edit the association of employee with restaurant',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the updated association of employee with restaurant.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Could not find any association of employee with restaurant.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_ACCEPTABLE,
    description:
      "Employee or Restaurant can't be changed or An admin can't be deleted",
  })
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  @UseGuards(JwtAuthGuard)
  @Put('restaurant/employee/update/:id')
  public async update(
    @Param('id') id: string,
    @Body() uEmployeeDTO: UpdateEmployeeDTO,
    @User() user: IUser,
  ): Promise<IEmployee> {
    try {
      return this.employeeService.update(id, user, uEmployeeDTO);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @ApiExcludeEndpoint()
  @Get('restaurant/employee/update/:id')
  public updateGet() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Post('restaurant/employee/update/:id')
  public updatePost() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Patch('restaurant/employee/update/:id')
  public updatePatch() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete('restaurant/employee/update/:id')
  public updateDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  /**
   * Fetches all employee of restaurant
   * @returns {Promise<IPaginateEmployee} queried user data
   */
  @ApiOperation({ summary: 'Fetches all employee of restaurant' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'This is private api. Fetches all employee of restaurant.',
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
  @UseGuards(JwtAuthGuard)
  @Get('restaurant/employees')
  @UsePipes(new ValidationPipe(true))
  findAllEmployee(
    @Query() query: SearchEmployeeDTO,
  ): Promise<IPaginateEmployee> {
    try {
      return this.employeeService.findAllEmployee(query);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @ApiExcludeEndpoint()
  @Post('restaurant/employees')
  public findAllEmployeePost() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Put('restaurant/employees')
  public findAllEmployeePut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Patch('restaurant/employees')
  public findAllEmployeePatch() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete('restaurant/employees')
  public findAllEmployeeDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  /**
   * count restaurant
   * @returns {Promise<IPaginateRestaurant>}
   */
  @ApiOperation({ summary: 'Count restaurant' })
  @UsePipes(new ValidationPipe(true))
  @UseGuards(JwtAuthGuard)
  @Get('restaurant/employees/count')
  public count(@Query() query: SearchRestaurantDTO): Promise<number> {
    try {
      return this.employeeService.count(query);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
  @ApiExcludeEndpoint()
  @Post('restaurant/employees/count')
  public countPost() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Put('restaurant/employees/count')
  public countPut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Patch('restaurant/employees/count')
  public countPatch() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete('restaurant/employees/count')
  public countDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }
}
