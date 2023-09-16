import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PointRecordService } from './point-record.service';
import { CreatePointRecordDto } from './dto/request/create-point-record.dto';
import { PointRecordDto } from './dto/response/point-record.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePointRecordDto } from './dto/request/update-point-record.dto';
import { GetAllPointRecordsResponseDto } from './dto/response/get-all-point-records.dto';
import {
  PointRecordEnum,
  PointRecordJustificationEnum,
} from './entity/point-record.entity';

@ApiBearerAuth()
@ApiTags('Point-Record')
@Controller('point-records')
export class PointRecordController {
  constructor(private readonly pointRecordService: PointRecordService) {}

  @UseGuards(AuthGuard())
  @Post()
  @ApiOperation({
    summary: 'Cria um novo registro de ponto',
  })
  @ApiCreatedResponse({ type: PointRecordDto })
  @ApiConflictResponse({
    description: 'Já existe um registro desse tipo para este usuário hoje',
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  async createPointRecord(@Body() createPointRecord: CreatePointRecordDto) {
    return await this.pointRecordService.createPointRecord(createPointRecord);
  }

  @UseGuards(AuthGuard())
  @Put()
  @ApiOperation({
    summary: 'Atualiza um registro de ponto',
  })
  @ApiOkResponse({ type: PointRecordDto })
  @ApiNotFoundResponse({ description: 'Registro de ponto não encontrado' })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  async updatePointRecordById(
    @Body() updatePointRecordDto: UpdatePointRecordDto,
  ) {
    return await this.pointRecordService.updatePointRecordById(
      updatePointRecordDto,
    );
  }

  @UseGuards(AuthGuard())
  @Get(':pointRecordId')
  @ApiOperation({
    summary: 'Retorna o registro de ponto pelo id',
  })
  @ApiOkResponse({ type: PointRecordDto })
  @ApiNotFoundResponse({ description: 'Registro de ponto não encontrado' })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  async getPointRecordsById(@Query('pointRecordId') pointRecordId: string) {
    return await this.pointRecordService.getPointRecordsById(pointRecordId);
  }

  @UseGuards(AuthGuard())
  @Get()
  @ApiOperation({
    summary: 'Retorna todos os registros de ponto',
  })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'pointRecordType', required: false })
  @ApiQuery({ name: 'justificationType', required: false })
  @ApiQuery({ name: 'createdAt', required: false })
  @ApiOkResponse({ type: GetAllPointRecordsResponseDto })
  async getAllPointrecords(
    @Query('take') take: 10,
    @Query('skip') skip: 0,
    @Query('userId') userId?: string,
    @Query('pointRecordType') pointRecordType?: PointRecordEnum,
    @Query('justificationType')
    justificationType?: PointRecordJustificationEnum,
    @Query('createdAt') createdAt?: Date,
  ) {
    return await this.pointRecordService.getAllPointrecords(
      take,
      skip,
      userId,
      pointRecordType,
      justificationType,
      createdAt,
    );
  }

  @UseGuards(AuthGuard())
  @Delete(':pointRecordId')
  @ApiOperation({
    summary: 'Deleta o registro de ponto pelo id',
  })
  @ApiOkResponse({ type: PointRecordDto })
  @ApiNotFoundResponse({ description: 'Registro de ponto não encontrado' })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  async deletePointRecordById(@Query('pointRecordId') pointRecordId: string) {
    return {
      message:
        await this.pointRecordService.deletePointRecordById(pointRecordId),
    };
  }
}
