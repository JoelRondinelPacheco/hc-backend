import { IsNotEmpty, IsString } from 'class-validator';
import { TokenI } from '../interfaces/token';
import { LoginEmployeeATResDTO } from '../interfaces/info';

export class LoginEPDTO {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginRFResDTO {
  accessToken: TokenI;
  user: LoginEmployeeATResDTO;
}

export class LoginEPResDTO extends LoginRFResDTO {
  refreshToken: TokenI;
}
