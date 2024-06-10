import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bycrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        
        private readonly jwtService: JwtService,
    ) {}

    async register(createUserDto: CreateUserDto) {
        try {
            const { password, ...userData } = createUserDto;
            const user = this.userRepository.create( {
                ...userData,
                password: bycrypt.hashSync( password, 10 )            
            });            

            await this.userRepository.save( user );
            delete user.password;

            return {
                ...user,
                token: this.getJwtToken({ id: user.id})
            };    
        } catch (error) {
            this.handleDBErrors(error);
        }
    }
  

    async login(loginUserDto: LoginUserDto){
        const { email, password } = loginUserDto;
        const user = await this.userRepository.findOne({
            where: { email },
            select: {email: true, password: true, id: true}
        });


        if (!user || !bycrypt.compareSync( password, user.password ))
            throw new BadRequestException('Invalid credentials');            

        return {
            ...user,
            token: this.getJwtToken({ id: user.id })
        };
    }


    async checkAuthStatus(user: User){
        try {                        
            return {
                ...user,
                token: this.getJwtToken({ id: user.id })
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }        
    }

    private handleDBErrors(error: any): never {
        if (error.code === '23505') 
            throw new BadRequestException( error.detail );

        throw new InternalServerErrorException('Please check the logs for more information');        
    }


    private getJwtToken(payload: JwtPayload): string {
        const token = this.jwtService.sign( payload );
        return token;
    }

}
