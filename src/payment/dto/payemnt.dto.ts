import { ApiProperty } from '@nestjs/swagger';

export class PaymentDTO implements Readonly<PaymentDTO> {
  @ApiProperty()
  stripeAPISecret: string;

  @ApiProperty()
  paymentInfo: any;
}
