import { Controller, Get, UseGuards, Req, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@Req() req: Request) {
    return 'Hello World!';
  }
}
