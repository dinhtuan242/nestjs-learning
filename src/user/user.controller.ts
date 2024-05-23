import { Controller, Get, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { MyJwtGuard } from '../auth/guard';
import { UserDecorator } from '../auth/decorator';

@Controller('user')
export class UserController {
  @UseGuards(MyJwtGuard)
  @Get('me')
  me(@UserDecorator() user: Request) {
    return user;
  }
}
