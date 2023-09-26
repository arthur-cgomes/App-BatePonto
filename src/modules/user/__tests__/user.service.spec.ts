import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import {
  MockRepository,
  repositoryMockFactory,
} from '../../../common/mock/test.util';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { User, UserTypeEnum } from '../entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/request/create-user.dto';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from '../dto/request/update-user.dto';
import { UpdateBlockedUserDto } from '../dto/request/update-blocked-user.dto';

describe('UserService', () => {
  let service: UserService;
  let repositoryMock: MockRepository<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: repositoryMockFactory<User>(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repositoryMock = module.get(getRepositoryToken(User));
  });

  beforeEach(() => jest.clearAllMocks());

  const user: User = {
    email: 'email@teste.com.br',
    password: 'password',
    name: 'name',
    cpf: 'cpf',
    birthDate: new Date(),
    phone: 'phone',
    blockedUser: false,
    userType: 'free_trial',
  } as User;

  describe('checkUserTologin', () => {
    it('should find a user by email', async () => {
      const userEmail = 'user@example.com';
      const userPassword = 'password';
      const user = new User();
      user.id = 'userId';
      user.email = userEmail;
      user.password = userPassword;
      (user.blockedUser = false),
        repositoryMock.findOne.mockResolvedValue(user);

      const result = await service.checkUserToLogin(userEmail);

      expect(result).toEqual(user);

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { email: userEmail },
        select: ['id', 'email', 'password', 'blockedUser'],
      });
    });

    it('should throw UnauthorizedException if user is blocked', async () => {
      const userEmail = 'user@example.com';
      const userPassword = 'password';
      const user = new User();
      user.id = 'userId';
      user.email = userEmail;
      user.password = userPassword;
      (user.blockedUser = true),
        (repositoryMock.findOne = jest.fn().mockResolvedValue(user));

      await expect(service.checkUserToLogin(user.email)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw NotFoundException when user with email not found', async () => {
      repositoryMock.findOne.mockResolvedValue(null);

      await expect(
        service.checkUserToLogin('nonexistent@example.com'),
      ).rejects.toThrowError(NotFoundException);

      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
        select: ['id', 'email', 'password', 'blockedUser'],
      });
    });
  });

  describe('createUser', () => {
    const createUserDto: CreateUserDto = {
      email: 'email@teste.com.br',
      password: 'password',
      name: 'name',
      cpf: 'cpf',
      birthDate: new Date(),
      phone: 'phone',
      userType: UserTypeEnum.FREE_TRIAL,
    };

    it('should create a user', async () => {
      repositoryMock.findOne = jest.fn();
      repositoryMock.create = jest.fn().mockReturnValue({ save: () => user });

      const result = await service.createUser(createUserDto);

      expect(result).toStrictEqual(user);
      expect(repositoryMock.create).toHaveBeenCalledWith({
        ...createUserDto,
      });
    });

    it('should throw the ConflictException exception when user already exists', async () => {
      const error = new ConflictException('user already exists');

      repositoryMock.findOne = jest.fn().mockReturnValue(user);

      await expect(service.createUser(createUserDto)).rejects.toStrictEqual(
        error,
      );
      expect(repositoryMock.create).not.toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    const updateUserDto: UpdateUserDto = {
      email: 'email@teste.com.br',
      name: 'name',
      birthDate: new Date(),
      phone: 'phone',
    };

    it('should successfully update a user', async () => {
      jest.spyOn(service, 'getUserById').mockResolvedValue(user);

      repositoryMock.preload = jest.fn().mockReturnValue({ save: () => user });

      const result = await service.updateUser(user.id, updateUserDto);

      expect(result).toStrictEqual(user);
      expect(repositoryMock.preload).toHaveBeenCalledWith({
        id: user.id,
        ...updateUserDto,
      });
    });
  });

  describe('updateUsersType', () => {
    it('should update user types successfully', async () => {
      const updateUserTypeDto = {
        userIds: ['userId-1', 'userId-2'],
        userType: UserTypeEnum.COLLABORATOR,
      };

      const user1 = new User();
      user1.id = 'userId-1';
      user1.userType = UserTypeEnum.FREE_TRIAL;

      const user2 = new User();
      user2.id = 'userId-2';
      user2.userType = UserTypeEnum.FREE_TRIAL;

      repositoryMock.findOne
        .mockResolvedValueOnce(user1)
        .mockResolvedValueOnce(user2);

      repositoryMock.save
        .mockResolvedValueOnce(user1)
        .mockResolvedValueOnce(user2);

      const result = await service.updateUsersType(updateUserTypeDto);

      expect(result).toHaveLength(2);
      expect(result[0].userType).toBe(UserTypeEnum.COLLABORATOR);
      expect(result[1].userType).toBe(UserTypeEnum.COLLABORATOR);
    });

    it('should throw BadRequestException for invalid user type', async () => {
      const updateUserTypeDto = {
        userIds: ['userId-1', 'userId-2'],
        userType: null,
      };

      await expect(service.updateUsersType(updateUserTypeDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateBlockedUsers', () => {
    it('should update blocked users successfully', async () => {
      const updateBlockedUserDto: UpdateBlockedUserDto = {
        userIds: ['userId-1', 'userId-2'],
        blockedUser: false,
      };

      const user1 = new User();
      user1.id = 'userId-1';
      user1.blockedUser = true;

      const user2 = new User();
      user2.id = 'userId-2';
      user2.blockedUser = true;

      repositoryMock.findOne
        .mockResolvedValueOnce(user1)
        .mockResolvedValueOnce(user2);

      repositoryMock.save
        .mockResolvedValueOnce({ ...user1, blockedUser: false })
        .mockResolvedValueOnce({ ...user2, blockedUser: false });

      const result = await service.updateBlockedUsers(updateBlockedUserDto);

      expect(result).toHaveLength(2);
      expect(result[0].blockedUser).toBe(false);
      expect(result[1].blockedUser).toBe(false);
    });

    it('should throw ConflictException for already blocked users', async () => {
      const updateBlockedUserDto: UpdateBlockedUserDto = {
        userIds: ['userId-1'],
        blockedUser: true,
      };

      const user1 = new User();
      user1.id = 'userId-1';
      user1.blockedUser = true;

      repositoryMock.findOne.mockResolvedValueOnce(user1);

      await expect(
        service.updateBlockedUsers(updateBlockedUserDto),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException for already blocked users', async () => {
      const updateBlockedUserDto: UpdateBlockedUserDto = {
        userIds: ['userId-1'],
        blockedUser: true,
      };

      const user1 = new User();
      user1.id = 'userId-1';
      user1.blockedUser = true;

      repositoryMock.findOne.mockResolvedValueOnce(user1);

      await expect(
        service.updateBlockedUsers(updateBlockedUserDto),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException for non-existent user ID', async () => {
      const updateBlockedUserDto: UpdateBlockedUserDto = {
        userIds: ['non-existent-id'],
        blockedUser: true,
      };

      repositoryMock.findOne.mockResolvedValueOnce(undefined);

      await expect(
        service.updateBlockedUsers(updateBlockedUserDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserById', () => {
    it('should successfully get a user by id', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(user);

      const result = await service.getUserById(user.id);

      expect(result).toStrictEqual(user);
    });

    it('Should throw the NotFoundException exception when user id not found', async () => {
      const error = new NotFoundException('user with this id not found');

      repositoryMock.findOne = jest.fn();

      await expect(service.getUserById(user.id)).rejects.toStrictEqual(error);
    });
  });

  describe('getAllUsers', () => {
    it('should successfully get all users', async () => {
      const take = 1;
      const skip = 0;
      const conditions: FindManyOptions<User> = {
        take,
        skip,
      };

      repositoryMock.findAndCount = jest.fn().mockReturnValue([[user], 10]);

      const result = await service.getAllUsers(
        take,
        skip,
        null,
        null,
        null,
        null,
      );

      expect(result).toStrictEqual({
        skip: 1,
        total: 10,
        users: [user],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('should successfully get all user with userId', async () => {
      const userId = 'userId';
      const take = 10;
      const skip = 0;
      const conditions: FindManyOptions<User> = {
        take,
        skip,
        where: { id: userId },
      };

      repositoryMock.findAndCount = jest.fn().mockReturnValue([[user], 10]);

      const result = await service.getAllUsers(
        take,
        skip,
        userId,
        null,
        null,
        null,
      );

      expect(result).toStrictEqual({
        skip: null,
        total: 10,
        users: [user],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('should successfully get all users with search', async () => {
      const search = 'aaa';
      const take = 10;
      const skip = 0;

      const conditions: FindManyOptions<User> = {
        take,
        skip,
        where: { name: ILike('%' + search + '%') },
      };

      repositoryMock.findAndCount = jest.fn().mockReturnValue([[user], 10]);

      const result = await service.getAllUsers(take, skip, null, search);

      expect(result).toStrictEqual({ skip: null, total: 10, users: [user] });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('should successfully get all users with email', async () => {
      const email = 'email@email@teste.com.br';
      const take = 10;
      const skip = 0;

      const conditions: FindManyOptions<User> = {
        take,
        skip,
        where: { email: ILike('%' + email + '%') },
      };

      repositoryMock.findAndCount = jest.fn().mockReturnValue([[user], 10]);

      const result = await service.getAllUsers(
        take,
        skip,
        null,
        null,
        email,
        null,
      );

      expect(result).toStrictEqual({ skip: null, total: 10, users: [user] });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('should successfully get all users with phone', async () => {
      const phone = 'phone';
      const take = 10;
      const skip = 0;

      const conditions: FindManyOptions<User> = {
        take,
        skip,
        where: { phone: ILike('%' + phone + '%') },
      };

      repositoryMock.findAndCount = jest.fn().mockReturnValue([[user], 10]);

      const result = await service.getAllUsers(
        take,
        skip,
        null,
        null,
        null,
        phone,
      );

      expect(result).toStrictEqual({ skip: null, total: 10, users: [user] });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('should successfully return an empty list of users', async () => {
      const take = 10;
      const skip = 10;
      const conditions: FindManyOptions<User> = {
        take,
        skip,
      };

      repositoryMock.findAndCount = jest.fn().mockReturnValue([[], 0]);

      const result = await service.getAllUsers(take, skip, null);

      expect(result).toStrictEqual({ skip: null, total: 0, users: [] });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });
  });

  describe('deleteUser', () => {
    it('should successfully delete a user', async () => {
      jest.spyOn(service, 'getUserById').mockResolvedValue(user);

      repositoryMock.remove = jest.fn();

      const result = await service.deleteUser(user.id);

      expect(result).toStrictEqual('user deleted successfully');
    });
  });
});
