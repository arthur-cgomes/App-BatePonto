import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/request/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const checkUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (checkUser) {
      throw new ConflictException('user already exists');
    }

    return await this.userRepository.create(createUserDto).save();
  }

  public async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('user with this id not found');
    }

    return user;
  }

  public async getUserByIds(ids: string[]): Promise<User[]> {
    return await this.userRepository.findBy({ id: In(ids) });
  }

  public async deleteUser(userId: string): Promise<string> {
    const user = await this.getUserById(userId);

    await this.userRepository.remove(user);

    return 'user deleted successfully';
  }
}
