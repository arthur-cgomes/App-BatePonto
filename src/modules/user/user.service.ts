import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserTypeEnum } from './entity/user.entity';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { GetAllUsersResponseDto } from './dto/response/get-all-user-response.dto';
import { UpdateUserTypeDto } from './dto/request/update-userType.dto';
import { UpdateBlockedUserDto } from './dto/request/update-blocked-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async checkUserToLogin(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'blockedUser'],
    });

    if (!user) throw new NotFoundException('user with this email not found');

    if (user.blockedUser) {
      throw new UnauthorizedException('deactivated user');
    }

    return user;
  }

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const checkUser = await this.userRepository.findOne({
      where: [{ email: createUserDto.email }, { cpf: createUserDto.cpf }],
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

  public async updateUsersType(
    updateUserTypeDto: UpdateUserTypeDto,
  ): Promise<User[]> {
    const updatedUsers: User[] = [];

    for (const userId of updateUserTypeDto.userIds) {
      const user = await this.getUserById(userId);

      if (!Object.values(UserTypeEnum).includes(updateUserTypeDto.userType)) {
        throw new BadRequestException('invalid user type');
      }

      user.userType = updateUserTypeDto.userType;

      await this.userRepository.preload(user);

      const savedUser = await this.userRepository.save(user);
      updatedUsers.push(savedUser);
    }

    return updatedUsers;
  }

  public async checkUserBlocked(
    userId: string,
    blockedUser: boolean,
  ): Promise<void> {
    const user = await this.getUserById(userId);

    if (user.blockedUser === blockedUser) {
      throw new ConflictException(`user already conflict`);
    }
  }

  public async updateBlockedUsers(
    updateBlockedUserDto: UpdateBlockedUserDto,
  ): Promise<User[]> {
    const updatedUsers: User[] = [];

    for (const userId of updateBlockedUserDto.userIds) {
      await this.checkUserBlocked(userId, updateBlockedUserDto.blockedUser);

      const user = await this.getUserById(userId);

      user.blockedUser = updateBlockedUserDto.blockedUser;

      const updatedUser = await this.userRepository.save(user);
      updatedUsers.push(updatedUser);
    }

    return updatedUsers;
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

  public async getAllUsers(
    take: number,
    skip: number,
    userId?: string,
    search?: string,
    email?: string,
    phone?: string,
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

    if (email) {
      conditions.where = { email: ILike('%' + email + '%') };
    }

    if (phone) {
      conditions.where = { phone: ILike('%' + phone + '%') };
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
