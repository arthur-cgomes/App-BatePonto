import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PointRecord } from './entity/point-record.entity';
import { CreatePointRecordDto } from './dto/request/create-point-record.dto';
import { Repository } from 'typeorm';
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
    currentDate.setHours(0, 0, 0, 0);

    await this.userService.getUserById(userId);

    const existingRecord = await this.pointRecordRepository.findOne({
      where: {
        userId,
        pointRecordType,
        createdAt: currentDate,
      },
    });

    if (existingRecord) {
      throw new ConflictException(
        'such a record already exists for this user today',
      );
    }

    const newPointRecord =
      this.pointRecordRepository.create(createPointRecordDto);
    return await this.pointRecordRepository.save(newPointRecord);
  }
}
