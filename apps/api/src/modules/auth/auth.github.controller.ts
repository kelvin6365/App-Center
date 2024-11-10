import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GithubAuthService } from './provider/github.service';
import { AppResponse } from '../../common/response/app.response';
import { Public } from '../../common/decorator/public';

@ApiTags('Auth')
@Controller({ path: '/auth/github', version: ['1'] })
export class AuthGithubController {
  constructor(private readonly githubAuthService: GithubAuthService) {}
  @Public()
  @Post('sign-in')
  async githubSignIn(@Body() body: { code: string }) {
    return new AppResponse(
      await this.githubAuthService.handleGithubAuth(body.code),
    );
  }
}
