import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { StripeService } from './stripe.service';
import { CreatePaymentIntentInput } from './dto/create-payment-intent.input';

@Resolver()
export class StripeResolver {
  constructor(private readonly stripeService: StripeService) {}

  @Mutation(() => String)
  async createPaymentIntent(
    @Args('createPaymentIntentInput') createPaymentIntentInput: CreatePaymentIntentInput,
  ) {
    const { amountOfCents, currency } = createPaymentIntentInput;
    const paymentIntent = await this.stripeService.createPaymentIntent(amountOfCents, currency);
    return paymentIntent.client_secret; // The front-end will use this client_secret to initialize the payment process
  }

  @Mutation(() => String)
  async createCheckoutSession(): Promise<string> {
    const session = await this.stripeService.createCheckoutSession();
    return session.id;
  }
}
