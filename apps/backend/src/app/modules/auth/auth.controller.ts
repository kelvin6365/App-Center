import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorator/public';
import { ApiResponseSchema } from '../../common/decorator/swagger.decorator';
import { AppResponse } from '../../common/response/app.response';
import { SignUpDTO } from './dto/signup.request.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from '../../common/decorator/user.decorator';
import { CurrentUserDTO } from './dto/current.user.dto';
import { LoginRequestDTO } from './dto/login.request.dto';
import { LoginResponseDTO } from './dto/login.response.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { Response } from 'express';

@ApiTags('Auth')
@Controller({ path: '/auth', version: ['1'] })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  @ApiResponseSchema(HttpStatus.OK, 'OK')
  async register(@Body() data: SignUpDTO): Promise<AppResponse<boolean>> {
    return new AppResponse<boolean>(await this.authService.signUp(data));
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @ApiBody({ type: LoginRequestDTO })
  @ApiResponseSchema(HttpStatus.OK, 'OK', LoginResponseDTO)
  async login(
    @CurrentUser() user: CurrentUserDTO,
    @Res({ passthrough: true }) response: Response
  ) {
    response.clearCookie('Authentication');
    const result: LoginResponseDTO = await this.authService.signIn(user);
    response.cookie('Authentication', result.accessToken);
    return new AppResponse(result);
  }

  // @Public()
  // @UseGuards(JwtRefreshGuard)
  // @Get('refresh')
  // @ApiHeader({ name: 'x-refresh-token' })
  // async refresh(@CurrentUser() user: CurrentUserDTO) {
  //   return new AppResponse(await this.authManager.signIn(user));
  // }

  // @Get('verify/email')
  // @ApiBearerAuth()
  // @ApiResponseSchema(HttpStatus.OK, 'OK')
  // async emailVerifyRequest(@CurrentUser() user: CurrentUserDTO) {
  //   return new AppResponse(await this.authManager.emailVerifyRequest(user));
  // }

  // @Public()
  // @Post('verify/email')
  // @ApiResponseSchema(HttpStatus.OK, 'OK')
  // async emailVerify(@Body() request: EmailVerifyRequestDTO) {
  //   await this.authManager.emailVerify(request);
  //   return new AppResponse();
  // }
}
