import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientDTO, UpdateClientDTO } from '../dto/client.dto';
import { ClientService } from '../services/client.service';
import { RolesAccess } from 'src/auth/decorators/roleaccess.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
  @RolesAccess('ADMIN')
  @Post('agregar')
  public async createClient(@Body() body: ClientDTO) {
    return await this.clientService.createClient(body);
  }
  @RolesAccess('EMPLOYEE')
  @Get('client/id/:clientId')
  public async getClientById(@Param('clientId') clientId: string) {
    return await this.clientService.getClientById(clientId);
  }
  //ADMIN Y EMPLOYEE

  @RolesAccess('EMPLOYEE')
  @Get('all')
  public async getAllClients() {
    return await this.clientService.getAllClients();
  }

  @RolesAccess('ADMIN')
  @Put('edit/:clientId')
  public async editClient(
    @Param('clientId') clientId: string,
    @Body() body: UpdateClientDTO,
  ) {
    return await this.clientService.updateClient(clientId, body);
  }

  @RolesAccess('ADMIN')
  @Delete('delete/:clientId')
  public async deleteClient(@Param('clientId') clientId: string) {
    return await this.deleteClient(clientId);
  }
}
