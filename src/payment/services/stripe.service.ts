import { Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';
import { PaymentDTO } from '../dto';

@Injectable()
export class StripeService {
  private stripeClient;
  /**
   * Create payment
   * @param {CreatePaymentDTO} cPaymentDTO
   * @returns {Promise<any>}
   */
  async createPaymentIntent(paymentDto: PaymentDTO): Promise<any> {
    this.stripeClient = new Stripe(paymentDto?.stripeAPISecret, {
      apiVersion: null,
    });
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await this.stripeClient.paymentIntents.create({
      amount: this.calculateOrderAmount(paymentDto.paymentInfo),
      currency: 'gbp',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  calculateOrderAmount(paymentInfo) {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    const amount = parseFloat((paymentInfo.grandTotal * 100).toFixed(2));
    return amount;
  }
}
