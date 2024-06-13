import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './common/filters/http-error.filter';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DemographyModule } from './demography/demography.module';
import { EmailModule } from './email/email.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { MenuModule } from './menu/menu.module';
import { OrderModule } from './order/order.module';
import { CategoryModule } from './category/category.module';
import { FilesModule } from './files/files.module';
import { PaymentModule } from './payment/payment.module';
import { PrintModule } from './print/print.module';
import 'dotenv/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { toHumanDateFormat } from './common/utils/helper';

const DB_CONNECTION = process.env.DB_CONNECTION;

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(DB_CONNECTION),
    UserModule,
    AuthModule,
    FilesModule,
    DemographyModule,
    EmailModule,
    RestaurantModule,
    MenuModule,
    OrderModule,
    CategoryModule,
    PaymentModule,
    PrintModule,
    MailerModule.forRoot({
      transport: {
        host: 'mail.google.com',
        port: 123,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      template: {
        adapter: new HandlebarsAdapter({
          toHumanDateFormat: toHumanDateFormat,
        }),
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
