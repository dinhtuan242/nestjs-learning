import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: AuthDto) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: AuthDto) {
    return this.authService.login(body);
  }
}
