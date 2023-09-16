import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PointRecord } from './entity/point-record.entity';
import { CreatePointRecordDto } from './dto/request/create-point-record.dto';
import { Between, Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class PointRecordService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(PointRecord)
    private readonly pointRecordRepository: Repository<PointRecord>,
  ) {}

  async createPointRecord(
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

  public async deletePointRecordById(pointRecordId: string): Promise<string> {
    const pointRecord = await this.getPointRecordsById(pointRecordId);

    await this.pointRecordRepository.remove(pointRecord);

    return 'point record deleted successfully';
  }
}
