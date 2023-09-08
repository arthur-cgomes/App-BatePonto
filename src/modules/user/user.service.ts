import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { FindManyOptions, ILike, In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { GetAllUsersResponseDto } from './dto/response/get-all-user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async checkUserToLogin(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
    if (!user) throw new NotFoundException('user with this email not found');

    return user;
  }

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const checkUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (checkUser) {
      throw new ConflictException('user already exists');
    }

    return await this.userRepository.create(createUserDto).save();
  }

  public async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    await this.getUserById(userId);

    return await (
      await this.userRepository.preload({
        id: userId,
        ...updateUserDto,
      })
    ).save();
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

  public async getAllUsers(
    take: number,
    skip: number,
    userId?: string,
    search?: string,
  ): Promise<GetAllUsersResponseDto> {
    const conditions: FindManyOptions<User> = {
      take,
      skip,
    };

    if (userId) {
      conditions.where = { id: userId };
    }

    if (search) {
      conditions.where = { name: ILike('%' + search + '%') };
    }

    const [users, count] = await this.userRepository.findAndCount(conditions);

    if (users.length == 0) {
      return { skip: null, total: 0, users };
    }
    const over = count - Number(take) - Number(skip);
    skip = over <= 0 ? null : Number(skip) + Number(take);

    return { skip, total: count, users };
  }

  public async deleteUser(userId: string): Promise<string> {
    const user = await this.getUserById(userId);

    await this.userRepository.remove(user);

    return 'user deleted successfully';
  }
}
