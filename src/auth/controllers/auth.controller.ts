import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginEPDTO } from '../dto/login.dto';
import { Login } from '../decorators/login.decorator';
import { Request } from 'express';
import { LoginGuard } from '../guards/login.guard';
import { LoginAccess } from '../decorators/login-access.decorator';
import { LoginRefresh } from '../decorators/login-refresh.decorator';

@Controller('auth')
@UseGuards(LoginGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Login()
  @Post('login')
  public async login(@Body() body: LoginEPDTO) {
    return await this.authService.login(body);
  }

  @LoginRefresh()
  @Post('refresh')
  public async loginWithRefreshToken(@Req() req: Request) {
    return await this.authService.loginWithRefreshToken(req);
  }
}
