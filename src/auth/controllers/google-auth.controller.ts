import { Controller, Res, Logger, Get, UseGuards, Req } from '@nestjs/common';
import { GoogleAuthService } from '../services';
import { GoogleOauthGuard } from '../guards/google-oauth.guard';

/**
 * Google Auth Controller
 */
@Controller('user/google/login')
export class GoogleAuthController {
  private readonly logger = new Logger(GoogleAuthController.name);

  /**
   * Constructor
   * @param {GoogleAuthService} googleAuthService
   */
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  // @Get()
  // @UseGuards(GoogleOauthGuard)
  // async googleAuth(@Req() _req) {
  //   // Guard redirects
  // }

  /**
   * Gooogle login redirect
   * @Req {Object} request
   * @Res {Object} response
   * @returns {Promise<any>}
   */
  @Get('redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req, @Res() res) {
    const authRes = await this.googleAuthService.login(req.user);
    return res
      .status(authRes.status)
      .set({
        'X-EMENU-KEY': authRes.token,
        'X-EMENU-KEY-EXPIRES': authRes.expiresIn,
      })
      .json(authRes.user);
  }
}
