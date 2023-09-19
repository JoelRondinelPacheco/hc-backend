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
import { AdminDTO, AdminUpdateDTO } from '../dto/admin.dto';
import { AdminService } from '../services/admin.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesAccess } from 'src/auth/decorators/roleaccess.decorator';

//@RolesAccess('ADMIN')
@UseGuards(AuthGuard)
@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Post('agregar')
  public async registerAdmin(@Body() body: AdminDTO) {
    console.log(new Date(body.birthday));

    return await this.adminService.createAdmin(body);
  }

  @Get('all')
  public async findAllAdmins() {
    return await this.adminService.getAllAdmins();
  }

  @Get('/admin/id/:adminId')
  public async findAdminById(@Param('adminId') adminId: string) {
    return await this.adminService.getAdminById(adminId);
  }

  @Get('fullinfo/:adminId')
  public async adminFullInfo(@Param('adminId') adminId: string) {
    return await this.adminService.adminFullInfo(adminId);
  }

  @Put('edit/:adminId')
  public async updateAdmin(
    @Param('adminId') adminId: string,
    @Body() body: AdminUpdateDTO,
  ) {
    return await this.adminService.updateAdmin(adminId, body);
  }

  @Delete('delete/:adminId')
  public async deleteAdmin(@Param('adminId') adminId: string) {
    return await this.adminService.deleteAdmin(adminId);
  }
}
