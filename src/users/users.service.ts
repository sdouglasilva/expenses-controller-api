import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs'
import { RegisterDto } from '@/auth/dto/register.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ){}

  async create(registerDto:RegisterDto): Promise<User> {
    const{name,email,password} = registerDto;
    const hashedPassword = await bcrypt.hash(password,10);
    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword

    });
    await this.usersRepository.save(user);
    delete user.password;
    return user;
  }

  async findByEmail(email:string): Promise<User | undefined>{
    return this.usersRepository.findOne({
      where:{email},
      select:['id','name','email','password']
    })
  }
  async findById(id:string): Promise<User>{
    const user = await this.usersRepository.findOneBy({id});
    
    if(!user){
      throw new UnauthorizedException(`Usuário com id "${id}" - Não encontrado`)
    }

    delete user.password
    return user 

    }
}

