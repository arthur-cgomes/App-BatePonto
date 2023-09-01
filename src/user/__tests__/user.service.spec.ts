import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import {
  MockRepository,
  repositoryMockFactory,
} from '../../common/mock/test.util';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../dto/request/update-user.dto';

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
    name: 'name',
    cpf: 'cpf',
    birthDate: new Date(),
    phone: 'phone',
  } as User;

  describe('createUser', () => {
    const createUserDto: CreateUserDto = {
      email: 'email@teste.com.br',
      name: 'name',
      cpf: 'cpf',
      birthDate: new Date(),
      phone: 'phone',
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

  describe('getUserByIds', () => {
    it('should successfully get users by ids', async () => {
      repositoryMock.findBy = jest.fn().mockReturnValue([user]);

      const result = await service.getUserByIds([user.id]);

      expect(result).toStrictEqual([user]);
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

      const result = await service.getAllUsers(take, skip, null, null);

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

      const result = await service.getAllUsers(take, skip, userId);

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

  // End unit tests
});
