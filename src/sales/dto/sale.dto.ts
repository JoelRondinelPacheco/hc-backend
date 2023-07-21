import { IsNotEmpty } from 'class-validator';
import { EmployeeDTO } from 'src/employees/dto/employee.dto';

export class CreateSaleDTO {
  @IsNotEmpty()
  employee: EmployeeDTO;
}

export class CreateSaleResDTO extends CreateSaleDTO {
  @IsNotEmpty()
  isCompleted: boolean;
}

export class finishSaleDTO extends CreateSaleResDTO {}
