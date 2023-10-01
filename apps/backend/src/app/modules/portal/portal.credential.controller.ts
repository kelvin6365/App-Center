import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseSchema } from '../../common/decorator/swagger.decorator';
import { AppResponse } from '../../common/response/app.response';
import { CurrentUser } from '../../common/decorator/user.decorator';
import { CurrentUserDTO } from '../auth/dto/current.user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CredentialService } from '../credential/credential.service';
import { CreateCredentialRequestDTO } from '../credential/dto/create.credential.request.dto';
import { CredentialComponentResponseDTO } from '../credential/dto/credential.component.response.dto';
import { CredentialResponseDTO } from '../credential/dto/credential.response.dto';
import { UpdateCredentialRequestDTO } from '../credential/dto/update.credential.request.dto';

@ApiTags('Portal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: '/portal/credential', version: ['1'] })
export class PortalCredentialController {
  constructor(private readonly credentialService: CredentialService) {}

  //Get All Credential components
  @Get('component')
  @ApiOperation({ summary: 'Get All Credential components' })
  @ApiResponseSchema(HttpStatus.OK, 'OK', CredentialComponentResponseDTO)
  async getAllCredentialComponents() {
    return new AppResponse(
      await this.credentialService.getAllCredentialComponents()
    );
  }

  //Get Credential Component
  @Get('component/:credentialComponentName')
  @ApiOperation({ summary: 'Get Credential Component' })
  @ApiResponseSchema(HttpStatus.OK, 'OK', CredentialComponentResponseDTO)
  async getCredentialComponent(
    @Param('credentialComponentName') credentialComponentName: string
  ): Promise<AppResponse<CredentialComponentResponseDTO>> {
    return new AppResponse<CredentialComponentResponseDTO>(
      await this.credentialService.getCredentialComponent(
        credentialComponentName
      )
    );
  }

  //Get All Credentials
  @Get('/tenant/:tenantId')
  @ApiOperation({ summary: 'Get All Credentials' })
  @ApiQuery({ required: false, name: 'name' })
  @ApiResponseSchema(HttpStatus.OK, 'OK')
  async getAllCredentials(
    @Param('tenantId') tenantId: string,
    @Query('name') name: string,
    @CurrentUser() user: CurrentUserDTO
  ) {
    return new AppResponse(
      await this.credentialService.getAllCredentials(tenantId, name, user)
    );
  }

  //Get Credential
  @Get(':id')
  @ApiOperation({ summary: 'Get Credential' })
  @ApiResponseSchema(HttpStatus.OK, 'OK', CredentialResponseDTO)
  async getCredential(
    @Param('id') credentialId: string,
    @CurrentUser() user: CurrentUserDTO
  ): Promise<AppResponse<CredentialResponseDTO>> {
    return new AppResponse<CredentialResponseDTO>(
      await this.credentialService.getCredential(credentialId, user)
    );
  }

  //Create Credential
  @Post()
  @ApiOperation({ summary: 'Create Credential' })
  @ApiResponseSchema(HttpStatus.OK, 'OK', CredentialResponseDTO)
  async createCredential(
    @Body() createCredentialDTO: CreateCredentialRequestDTO,
    @CurrentUser() user: CurrentUserDTO
  ): Promise<AppResponse<boolean>> {
    return new AppResponse<boolean>(
      await this.credentialService.createCredential(createCredentialDTO, user)
    );
  }

  //Update Credential
  @Put(':id')
  @ApiOperation({ summary: 'Update Credential' })
  @ApiResponseSchema(HttpStatus.OK, 'OK', CredentialResponseDTO)
  async updateCredential(
    @Param('id') credentialId: string,
    @Body() updateCredentialDTO: UpdateCredentialRequestDTO,
    @CurrentUser() user: CurrentUserDTO
  ): Promise<AppResponse<boolean>> {
    return new AppResponse<boolean>(
      await this.credentialService.updateCredential(
        credentialId,
        updateCredentialDTO,
        user
      )
    );
  }

  //Delete Credential
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Credential' })
  @ApiResponseSchema(HttpStatus.OK, 'OK')
  async deleteCredential(
    @Param('id') credentialId: string,
    @CurrentUser() user: CurrentUserDTO
  ): Promise<AppResponse<boolean>> {
    return new AppResponse<boolean>(
      await this.credentialService.deleteCredential(credentialId, user)
    );
  }
}
