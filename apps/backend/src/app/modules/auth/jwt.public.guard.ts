import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class JwtPublicGuard extends AuthGuard('jwt-public-token') {}
