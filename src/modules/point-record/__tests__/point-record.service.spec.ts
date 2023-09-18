import { Test, TestingModule } from '@nestjs/testing';
import { PointRecordService } from '../point-record.service';
import {
  PointRecord,
  PointRecordEnum,
  PointRecordJustificationEnum,
} from '../entity/point-record.entity';
import {
  MockRepository,
  repositoryMockFactory,
} from '../../../common/mock/test.util';
import { FindManyOptions, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../modules/user/entity/user.entity';
import { UserService } from '../../../modules/user/user.service';
import { UpdatePointRecordDto } from '../dto/request/update-point-record.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreatePointRecordDto } from '../dto/request/create-point-record.dto';

describe('PointRecordService', () => {
  let service: PointRecordService;
  let repositoryMock: MockRepository<Repository<PointRecord>>;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PointRecordService,
        {
          provide: getRepositoryToken(PointRecord),
          useValue: repositoryMockFactory<PointRecord>(),
        },
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: repositoryMockFactory<User>(),
        },
      ],
    }).compile();

    service = module.get<PointRecordService>(PointRecordService);
    userService = module.get<UserService>(UserService);
    repositoryMock = module.get(getRepositoryToken(PointRecord));
  });

  beforeEach(() => jest.resetAllMocks());

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

  const pointRecord: PointRecord = {
    userId: 'userId',
    pointRecordType: 'prohibited',
    justificationType: 'record',
  } as PointRecord;

  describe('createPointRecord', () => {
    it('should create a point record', async () => {
      jest.spyOn(userService, 'getUserById').mockResolvedValue(user);

      jest.spyOn(repositoryMock, 'findOne').mockResolvedValue(undefined);

      const createPointRecordDto: CreatePointRecordDto = {
        userId: 'userId',
        pointRecordType: PointRecordEnum.PROHIBITED,
      };

      jest.spyOn(repositoryMock, 'create').mockReturnValue({
        ...createPointRecordDto,
        id: 'pointRecordId',
      });
      jest.spyOn(repositoryMock, 'save').mockResolvedValue({
        ...createPointRecordDto,
        id: 'pointRecordId',
      });

      const result = await service.createPointRecord(createPointRecordDto);

      expect(result).toEqual({
        ...createPointRecordDto,
        id: 'pointRecordId',
      });
    });

    it('should throw ConflictException for duplicate point record', async () => {
      jest.spyOn(userService, 'getUserById').mockResolvedValue(user);

      const createPointRecordDto: CreatePointRecordDto = {
        userId: 'userId',
        pointRecordType: PointRecordEnum.PROHIBITED,
      };

      jest.spyOn(repositoryMock, 'findOne').mockResolvedValue({
        id: 'existingRecordId',
      });

      await expect(
        service.createPointRecord(createPointRecordDto),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException for non-existent user', async () => {
      jest
        .spyOn(userService, 'getUserById')
        .mockRejectedValue(new NotFoundException('user not found'));

      const createPointRecordDto: CreatePointRecordDto = {
        userId: 'userId',
        pointRecordType: PointRecordEnum.PROHIBITED,
      };

      await expect(
        service.createPointRecord(createPointRecordDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePointRecordById', () => {
    const updatePointRecordDto: UpdatePointRecordDto = {
      pointRecordId: 'pointRecordId',
      pointRecordType: PointRecordEnum.PROHIBITED,
      justificationType: PointRecordJustificationEnum.RECORD,
    };

    it('should successfully update a point record', async () => {
      jest.spyOn(service, 'getPointRecordsById').mockResolvedValue(pointRecord);

      repositoryMock.preload = jest
        .fn()
        .mockReturnValue({ save: () => pointRecord });

      const result = await service.updatePointRecordById(updatePointRecordDto);

      expect(result).toStrictEqual(pointRecord);
      expect(repositoryMock.preload).toHaveBeenCalledWith({
        id: updatePointRecordDto.pointRecordId,
        ...updatePointRecordDto,
      });
    });
  });

  describe('getPointRecordsById', () => {
    it('should successfully get a point record by id', async () => {
      repositoryMock.findOne = jest.fn().mockReturnValue(pointRecord);

      const result = await service.getPointRecordsById(pointRecord.id);

      expect(result).toStrictEqual(pointRecord);
    });

    it('should throw the NotFoundException exception when point record id not found', async () => {
      const error = new NotFoundException('point record not found');

      repositoryMock.findOne = jest.fn();

      await expect(
        service.getPointRecordsById(pointRecord.id),
      ).rejects.toThrowError(error);
    });
  });

  describe('getAllPointrecords', () => {
    it('should successfully get all point records', async () => {
      const take = 1;
      const skip = 0;
      const conditions: FindManyOptions<PointRecord> = {
        take,
        skip,
      };

      repositoryMock.findAndCount = jest
        .fn()
        .mockReturnValue([[pointRecord], 10]);

      const result = await service.getAllPointrecords(
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
        pointRecords: [pointRecord],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('should successfully get all point record with userId', async () => {
      const userId = 'userId';
      const take = 10;
      const skip = 0;
      const conditions: FindManyOptions<PointRecord> = {
        take,
        skip,
        where: { id: userId },
      };

      repositoryMock.findAndCount = jest
        .fn()
        .mockReturnValue([[pointRecord], 10]);

      const result = await service.getAllPointrecords(
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
        pointRecords: [pointRecord],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('should successfully get all point record with pointRecordType', async () => {
      const pointRecordType = PointRecordEnum.PROHIBITED;
      const take = 10;
      const skip = 0;
      const conditions: FindManyOptions<PointRecord> = {
        take,
        skip,
        where: { pointRecordType },
      };

      repositoryMock.findAndCount = jest
        .fn()
        .mockReturnValue([[pointRecord], 10]);

      const result = await service.getAllPointrecords(
        take,
        skip,
        null,
        pointRecordType,
        null,
        null,
      );

      expect(result).toStrictEqual({
        skip: null,
        total: 10,
        pointRecords: [pointRecord],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('should successfully get all point record with justificationType', async () => {
      const justificationType = PointRecordJustificationEnum.RECORD;
      const take = 10;
      const skip = 0;
      const conditions: FindManyOptions<PointRecord> = {
        take,
        skip,
        where: { justificationType },
      };

      repositoryMock.findAndCount = jest
        .fn()
        .mockReturnValue([[pointRecord], 10]);

      const result = await service.getAllPointrecords(
        take,
        skip,
        null,
        null,
        justificationType,
        null,
      );

      expect(result).toStrictEqual({
        skip: null,
        total: 10,
        pointRecords: [pointRecord],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('should successfully get all point record with justificationType', async () => {
      const justificationType = PointRecordJustificationEnum.RECORD;
      const take = 10;
      const skip = 0;
      const conditions: FindManyOptions<PointRecord> = {
        take,
        skip,
        where: { justificationType },
      };

      repositoryMock.findAndCount = jest
        .fn()
        .mockReturnValue([[pointRecord], 10]);

      const result = await service.getAllPointrecords(
        take,
        skip,
        null,
        null,
        justificationType,
        null,
      );

      expect(result).toStrictEqual({
        skip: null,
        total: 10,
        pointRecords: [pointRecord],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('should successfully get all point record with createdAt', async () => {
      const createdAt = new Date();
      const take = 10;
      const skip = 0;
      const conditions: FindManyOptions<PointRecord> = {
        take,
        skip,
        where: { createdAt },
      };

      repositoryMock.findAndCount = jest
        .fn()
        .mockReturnValue([[pointRecord], 10]);

      const result = await service.getAllPointrecords(
        take,
        skip,
        null,
        null,
        null,
        createdAt,
      );

      expect(result).toStrictEqual({
        skip: null,
        total: 10,
        pointRecords: [pointRecord],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });

    it('should successfully return an empty list of point records', async () => {
      const take = 10;
      const skip = 0;
      const conditions: FindManyOptions<PointRecord> = {
        take,
        skip,
      };

      repositoryMock.findAndCount = jest.fn().mockReturnValue([[], 0]);

      const result = await service.getAllPointrecords(
        take,
        skip,
        null,
        null,
        null,
        null,
      );

      expect(result).toStrictEqual({
        skip: null,
        total: 0,
        pointRecords: [],
      });
      expect(repositoryMock.findAndCount).toHaveBeenCalledWith(conditions);
    });
  });

  describe('deletePointRecordById', () => {
    it('should successfully delete a point record by id', async () => {
      jest.spyOn(service, 'getPointRecordsById').mockResolvedValue(pointRecord);

      repositoryMock.remove = jest.fn();

      const result = await service.deletePointRecordById(pointRecord.id);

      expect(result).toStrictEqual('point record deleted successfully');
    });
  });
});
