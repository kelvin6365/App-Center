import {
  Body,
  Controller,
  Headers,
  Post,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { StripeService } from './stripe.service';
import { Request } from 'express';
import { Public } from '../../common/decorator/public';
import { CurrentUser } from '../../common/decorator/user.decorator';
import { CurrentUserDTO } from '../auth/dto/current.user.dto';
import { CreateCheckoutSessionDTO } from './dto/create.checkout.session.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Stripe')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'stripe', version: ['1'] })
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  //webhook
  @Public()
  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') sig: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    return await this.stripeService.handleWebhook(request, sig);
  }

  //checkout subscription
  @Post('checkout')
  async createCheckoutSession(
    @CurrentUser() user: CurrentUserDTO,
    @Body() dto: CreateCheckoutSessionDTO,
  ) {
    return await this.stripeService.createCheckoutSession(dto, user);
  }
}
