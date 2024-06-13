import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EmailService } from '../../email/email.service';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from '../../user/interfaces';

@Injectable()
export class EmailInterceptor implements NestInterceptor {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<IUser>,
    private readonly emailService: EmailService,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const route = req.route.path;
    const hostname = req.get('origin');
    const feHost = hostname || process.env.FE_HOST || 'http://localhost:3000';

    return next.handle().pipe(
      tap(async (res) => {
        const result = res.hasOwnProperty('data') ? res.data : res;
        let recipient: string;
        let subject: string;
        const template = 'template';
        const context: any = {
          nameUser: result.email,
          hasActionButton: true,
        };
        switch (route) {
          case '/user/register':
            if (method === 'POST') {
              recipient = result.email;
              subject = 'Verify Email Address';
              context.title = 'Please verify your email address.';
              context.description = `
              You’re almost there! Please verify your email
              address by clicking the button below. 
              `;
              context.buttonText = 'CLICK TO VERIFY';
              context.buttonUri = `${feHost}/verification?token=${result['emailProofToken']}`;
            }
            break;
          case '/user/verification':
            if (method === 'POST') {
              recipient = result.email;
              subject = 'Welcome To halabook!';
              context.title =
                'Your email address has successfully been verified!';
              context.description = `Congrats!
              We welcome you to halabook and look forward to growing
              together!`;
              context.buttonText = 'LOG IN';
              context.buttonUri = `${feHost}/signin`;
            }
            break;
          case '/user/generate/link':
            if (method === 'POST') {
              recipient = req.body.email;
              subject = 'Verification Completed';
              context.title = 'New Verification Email';
              context.description = `Please verify your email address to complete creating your account.`;
              context.buttonText = 'ACTIVATE';
              context.buttonUri = `${feHost}/verification?token=${recipient}`;
            }
            break;
          case '/user/reset-password/generate/link':
            if (method === 'POST') {
              const user = await this.userModel
                .findOne({ email: req.body.email })
                .lean()
                .exec();
              recipient = req.body.email;
              subject = 'Password Reset';
              context.title = 'Password Reset';
              context.description = `We got a request to reset your halabook Password. If you didn’t request a password request you can ignore this message and your password won’t be changed. You can also report to us for a suspicious password change attempt. Contact Us.`;
              context.buttonText = 'Reset Password';
              context.buttonUri = `${feHost}/reset-password?token=${user['passwordResetToken']}`;
            }
            break;
          case '/user/forget/password':
            if (method === 'PATCH') {
              recipient = result.email;
              subject = 'Password Reset';
              context.title = 'Password Reset';
              context.description = `Your have successfully changed your password`;
              context.buttonText = 'LOG IN';
              context.buttonUri = `${feHost}/signin`;
            }
            break;
          case '/user/reset/password':
            if (method === 'PATCH') {
              subject = 'Password Reset';
              recipient = result.email;
              context.title = 'Password Reset';
              context.description = `Your have successfully changed your password`;
              context.buttonText = 'LOG IN';
              context.buttonUri = `${feHost}/signin`;
            }
            break;
        }
        this.emailService.sendEmail(recipient, subject, context, template);
      }),
    );
  }
}
