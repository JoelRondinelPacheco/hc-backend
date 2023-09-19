import { ROLES } from 'src/constants/roles';
import { GameEntity } from 'src/games/entities/game.entity';

export interface LoginAdminATResDTO {
  id: string;
  firstName: string;
  lastName: string;
  birthday: Date;
  email: string;
  role: ROLES;
}

export interface InfoAdminPass extends LoginAdminATResDTO {
  password: string;
}

export interface LoginEmployeeATResDTO extends LoginAdminATResDTO {
  gameId: string;
}

export interface EmployeeInfo extends LoginEmployeeATResDTO {
  game: GameEntity;
}

export interface InfoEmployeePass extends LoginEmployeeATResDTO {
  password: string;
}
