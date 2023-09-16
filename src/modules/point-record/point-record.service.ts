import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PointRecord,
  PointRecordEnum,
  PointRecordJustificationEnum,
} from './entity/point-record.entity';
import { CreatePointRecordDto } from './dto/request/create-point-record.dto';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { UpdatePointRecordDto } from './dto/request/update-point-record.dto';
import { GetAllPointRecordsResponseDto } from './dto/response/get-all-point-records.dto';

@Injectable()
export class PointRecordService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(PointRecord)
    private readonly pointRecordRepository: Repository<PointRecord>,
  ) {}

  public async createPointRecord(
    createPointRecordDto: CreatePointRecordDto,
  ): Promise<PointRecord> {
    const { userId, pointRecordType } = createPointRecordDto;
    const currentDate = new Date();

    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      0,
      0,
      0,
    );
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      23,
      59,
      59,
    );

    await this.userService.getUserById(userId);

    const existingRecord = await this.pointRecordRepository.findOne({
      where: {
        userId,
        pointRecordType,
        createdAt: Between(startDate, endDate),
      },
    });

    if (existingRecord) {
      throw new ConflictException(
        'such a record already exists for this user and point type today',
      );
    }

    const newPointRecord =
      this.pointRecordRepository.create(createPointRecordDto);
    return await this.pointRecordRepository.save(newPointRecord);
  }

  public async updatePointRecordById(
    updatePointRecordDto: UpdatePointRecordDto,
  ): Promise<PointRecord> {
    await this.getPointRecordsById(updatePointRecordDto.pointRecordId);

    return await (
      await this.pointRecordRepository.preload({
        id: updatePointRecordDto.pointRecordId,
        ...updatePointRecordDto,
      })
    ).save();
  }

  public async getPointRecordsById(
    pointRecordId: string,
  ): Promise<PointRecord> {
    const pointRecord = await this.pointRecordRepository.findOne({
      where: { id: pointRecordId },
    });

    if (!pointRecord) {
      throw new NotFoundException('point record not found');
    }

    return pointRecord;
  }

  public async getAllPointrecords(
    take: number,
    skip: number,
    userId?: string,
    pointRecordType?: PointRecordEnum,
    justificationType?: PointRecordJustificationEnum,
    createdAt?: Date,
  ): Promise<GetAllPointRecordsResponseDto> {
    const conditions: FindManyOptions<PointRecord> = {
      take,
      skip,
    };

    if (userId) {
      conditions.where = { id: userId };
    }

    if (pointRecordType) {
      conditions.where = { pointRecordType };
    }

    if (justificationType) {
      conditions.where = { justificationType };
    }

    if (createdAt) {
      conditions.where = { createdAt };
    }

    const [pointRecords, count] =
      await this.pointRecordRepository.findAndCount(conditions);

    if (pointRecords.length == 0) {
      return { skip: null, total: 0, pointRecords };
    }
    const over = count - Number(take) - Number(skip);
    skip = over <= 0 ? null : Number(skip) + Number(take);

    return { skip, total: count, pointRecords };
  }

  public async deletePointRecordById(pointRecordId: string): Promise<string> {
    const pointRecord = await this.getPointRecordsById(pointRecordId);

    await this.pointRecordRepository.remove(pointRecord);

    return 'point record deleted successfully';
  }
}
