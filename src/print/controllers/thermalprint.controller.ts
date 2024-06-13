import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  MethodNotAllowedException,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PrintDTO } from '../dto/print.dto';
import { ThermalPrintService } from '../services';

/**
 * Print Controller
 */
@ApiTags('Printer')
@ApiResponse({
  status: HttpStatus.METHOD_NOT_ALLOWED,
  description: 'Method not allowed',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('print')
export class ThermalPrintController {
  /**
   * Constructor
   * @param {OrderService} orderService
   */
  constructor(private readonly thermalPrintService: ThermalPrintService) {}

  /**
   * Create order
   * @param {IUser} user
   * @param {CreateOrderDTO} cOrderDTO
   * @returns {Promise<IOrder>}
   */
  @ApiOperation({ summary: 'Order Creation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return order.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_ACCEPTABLE,
    description: 'Record already exist',
  })
  @Post()
  public async print(@Body() printDTO: PrintDTO): Promise<any> {
    try {
      return await this.thermalPrintService.print(printDTO);
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

  // @Post('test')
  // public async printTest(@Body() printDTO: PrintDTO): Promise<any> {
  //   try {
  //     return await this.thermalPrintService.printThermal(printDTO);
  //   } catch (err) {
  //     throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
  //   }
  // }
}
