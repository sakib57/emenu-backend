import {
  Controller,
  Post,
  Body,
  Res,
  Logger,
  Delete,
  Get,
  MethodNotAllowedException,
  Patch,
  Put,
  UsePipes,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../services';
import { AuthDTO } from '../dto/auth.dto';
import {
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { TrimPipe } from '../../common/pipes/trim.pipe';

/**
 * Auth Controller
 */
@Controller('user')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  /**
   * Constructor
   * @param {AuthService} authService
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * User login with jwtToken
   * @Res res
   * @Body {AuthDTO} loginDto
   * @returns {Promise<any>}
   */
  @ApiTags('User')
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({
    status: 200,
    description: 'Return user information.',
  })
  @ApiResponse({
    status: HttpStatus.METHOD_NOT_ALLOWED,
    description: 'Method not allowed',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data',
  })
  @UsePipes(new ValidationPipe(true))
  @UsePipes(new TrimPipe())
  @Post('login')
  public async login(@Res() res, @Body() loginDto: AuthDTO): Promise<any> {
    const authRes = await this.authService.login(loginDto);
    return res
      .status(authRes.status)
      .set({
        'X-EMENU-KEY': authRes.token,
        'X-EMENU-KEY-EXPIRES': authRes.expiresIn,
      })
      .json(authRes.user);
  }

  @ApiExcludeEndpoint()
  @Get('login')
  public loginGet() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Put('login')
  public loginPut() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Patch('login')
  public loginPatch() {
    throw new MethodNotAllowedException('Method not allowed');
  }

  @ApiExcludeEndpoint()
  @Delete('login')
  public loginDelete() {
    throw new MethodNotAllowedException('Method not allowed');
  }
}
