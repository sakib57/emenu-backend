import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  MethodNotAllowedException,
  Patch,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiExcludeEndpoint,
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { NullValidationPipe } from '../../common/pipes/null-validator.pipe';
import { TrimPipe } from '../../common/pipes/trim.pipe';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { PaymentDTO } from '../dto';
import { StripeService } from '../services';

/**
 * Stripe Controller
 */
@ApiTags('Payment')
@ApiResponse({
  status: HttpStatus.METHOD_NOT_ALLOWED,
  description: 'Method not allowed',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Server Error!',
})
@Controller('stripe')
export class StripeController {
  /**
   * Constructor
   * @param {StripeService} stripeService
   */
  constructor(private readonly stripeService: StripeService) {}

  /**
   * Create restaurant
   * @param {IUser} user
   * @param {CreateRestaurantDTO} cRestaurantDTO
   * @returns {Promise<IRestaurant>}
   */
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer Token',
  })
  @ApiOperation({ summary: 'Restaurant Creation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return new restaurant.',
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
  @Post('create-payment-intent')
  public async createPaymentIntent(
    @Body() paymentDto: PaymentDTO,
  ): Promise<any> {
    try {
      return await this.stripeService.createPaymentIntent(paymentDto);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  @ApiExcludeEndpoint()
  @Get('create')
  public createGet() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Put('create')
  public createPut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Patch('create')
  public createPatch() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete('create')
  public createDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }
}
