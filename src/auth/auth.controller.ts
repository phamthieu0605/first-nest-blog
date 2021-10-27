import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from 'src/models/user.model';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  register(@Body() credentials: RegisterDto) {
    return this.authService.register(credentials);
  }

  @Post('/login')
  login(@Body(ValidationPipe) credentials: LoginDto) {
    return this.authService.login(credentials);
  }
}
