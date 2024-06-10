import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, GetRawHeaders, RoleProtected } from './decorators/';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('profile')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @GetRawHeaders() headers: string[]
  ) {
    return {
      ok: true,
      message: 'This is a private route',
      user,
      userEmail,
      headers
    };
  }

  
  @Get('check-auth-status')
  @Auth()
  async checkAuthStatus(
    @GetUser() user: User,
  ){
    return this.authService.checkAuthStatus( user );
  }

  // @SetMetadata('roles', ['admin', 'super-user'])
  @Get('private')
  @RoleProtected( ValidRoles.admin, ValidRoles.superUser)
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute(
    @GetUser() user: User,
  ){
    return {
      ok: true,
      message: 'This is a private route',
      user
    };    
  }


  @Get('private3')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  privateRoute3(
    @GetUser() user: User,
  ){
    return {
      ok: true,
      message: 'This is a private route',
      user
    };    
  }

}
