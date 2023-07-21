import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EmployeesService } from '../services/employees.service';
import { EmployeeDTO, UpdateEmployeeDTO } from '../dto/employee.dto';
import { RolesAccess } from 'src/auth/decorators/roleaccess.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';

//@UseGuards(AuthGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  //@RolesAccess('ADMIN')
  @Post('agregar')
  public async createEmployee(@Body() body: EmployeeDTO) {
    return await this.employeesService.createEmployee(body);
  }

  //@RolesAccess('ONEEMPLOYEE')

  @Get('employee/id/:employeeId')
  public async getEmployeeById(@Param('employeeId') employeeId: string) {
    return await this.employeesService.getEmployeeById(employeeId);
  }

  @Get('email/:email')
  public async getEmployeeByEmail(@Param('email') email: string) {
    const emp = await this.employeesService.getEmployeeByEmail(email);
    console.log(emp);
  }

  //@RolesAccess('ADMIN')
  @Get('all')
  public async getAllEmployees() {
    return await this.employeesService.getAllEmployees();
  }

  //@RolesAccess('ONEEMPLOYEE')
  @Put('edit/:employeeId')
  public async updateEmployee(
    @Param('employeeId') employeeId: string,
    @Body() body: UpdateEmployeeDTO,
  ) {
    return await this.employeesService.updateEmployee(employeeId, body);
  }

  //@RolesAccess('ADMIN')
  @Delete('delete/:employeeId')
  public async deleteEmployee(@Param('employeeId') employeeId: string) {
    return await this.employeesService.deleteEmloyee(employeeId);
  }
}
