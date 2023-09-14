import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PointRecordService } from './point-record.service';
import { CreatePointRecordDto } from './dto/request/create-point-record.dto';
import { PointRecordDto } from './dto/response/point-record.dto';

@ApiBearerAuth()
@ApiTags('Point-Record')
@Controller('point-records')
export class PointRecordController {
  constructor(private readonly pointRecordService: PointRecordService) {}

  @Post()
  @ApiOperation({
    summary: 'Cria um novo registro de ponto',
  })
  @ApiCreatedResponse({ type: PointRecordDto })
  @ApiConflictResponse({
    description: 'Já existe um registro desse tipo para este usuário hoje',
  })
  async createPointRecord(@Body() createPointRecord: CreatePointRecordDto) {
    return await this.pointRecordService.createPointRecord(createPointRecord);
  }
}
