import { Body, Controller, Post, UseFilters, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuardLocal } from '../common/guards/auth-guard-local.service';
import { GetUserId } from '../common/decorators/get-user.decorator';
import { ValidationFilter } from '../common/filters/validation.filter';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuardLocal)
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@GetUserId() userId: number): Promise<any> {
    return this.authService.signIn(userId);
  }

  @Post('signup')
  @UseFilters(ValidationFilter)
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.usersService.create(createUserDto);
  }
}
