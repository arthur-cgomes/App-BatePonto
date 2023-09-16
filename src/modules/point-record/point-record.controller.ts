import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
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

  @Get(':pointRecordId')
  @ApiOperation({
    summary: 'Retorna o registro de ponto pelo id',
  })
  @ApiOkResponse({ type: PointRecordDto })
  @ApiNotFoundResponse({ description: 'Registro de ponto não encontrado' })
  async getPointRecordsById(@Query('pointRecordId') pointRecordId: string) {
    return await this.pointRecordService.getPointRecordsById(pointRecordId);
  }

  @Delete(':pointRecordId')
  @ApiOperation({
    summary: 'Deleta o registro de ponto pelo id',
  })
  @ApiOkResponse({ type: PointRecordDto })
  @ApiNotFoundResponse({ description: 'Registro de ponto não encontrado' })
  async deletePointRecordById(@Query('pointRecordId') pointRecordId: string) {
    return {
      message:
        await this.pointRecordService.deletePointRecordById(pointRecordId),
    };
  }
}
