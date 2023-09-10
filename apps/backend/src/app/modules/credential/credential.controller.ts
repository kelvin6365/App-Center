import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CredentialService } from './credential.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponseSchema } from '../../common/decorator/swagger.decorator';
import { AppResponse } from '../../common/response/app.response';
import { CredentialResponseDTO } from './dto/credential.response.dto';
import { CreateCredentialRequestDTO } from './dto/create.credential.request.dto';
import { UpdateCredentialRequestDTO } from './dto/update.credential.request.dto';
import { CurrentUser } from '../../common/decorator/user.decorator';
import { CurrentUserDTO } from '../auth/dto/current.user.dto';
import { CredentialComponentResponseDTO } from './dto/credential.component.response.dto';

@ApiTags('Credential')
@ApiBearerAuth()
@Controller({ path: 'credential', version: ['1'] })
export class CredentialController {
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
  @Get()
  @ApiOperation({ summary: 'Get All Credentials' })
  @ApiResponseSchema(HttpStatus.OK, 'OK')
  async getAllCredentials() {
    return new AppResponse(await this.credentialService.getAllCredentials());
  }

  //Get Credential
  @Get(':id')
  @ApiOperation({ summary: 'Get Credential' })
  @ApiResponseSchema(HttpStatus.OK, 'OK', CredentialResponseDTO)
  async getCredential(
    @Param('id') credentialId: string
  ): Promise<AppResponse<CredentialResponseDTO>> {
    return new AppResponse<CredentialResponseDTO>(
      await this.credentialService.getCredential(credentialId)
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
