import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { UserService } from './user.service';
import { UserDto } from './dto/response/user.dto';
import { CreateUserDto } from './dto/request/create-user.dto';
import { DeleteResponseDto } from './dto/response/delete-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { GetAllUsersResponseDto } from './dto/response/get-all-user-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserTypeDto } from './dto/request/update-userType.dto';

@ApiBearerAuth()
@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Cria um novo usuário',
  })
  @ApiCreatedResponse({ type: UserDto })
  @ApiConflictResponse({
    description: 'Usuário já cadastrado',
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @UseGuards(AuthGuard())
  @Put(':userId')
  @ApiOperation({
    summary: 'Atualiza um usuário',
  })
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(userId, updateUserDto);
  }

  @UseGuards(AuthGuard())
  @Put(':userId/userType')
  @ApiOperation({
    summary: 'Atualiza o tipo de usuário',
  })
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  async updateUserType(
    @Param('userId') userId: string,
    @Body() updateUserTypeDto: UpdateUserTypeDto,
  ) {
    return await this.userService.updateUserType(userId, updateUserTypeDto);
  }

  @UseGuards(AuthGuard())
  @Put(':userId/blockedUser')
  @ApiOperation({
    summary: 'Bloqueia e desbloqueia um usuário',
  })
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
  })
  async updateBlockedUser(
    @Param('userId') userId: string,
    @Body() blockedUser: boolean,
  ) {
    return await this.userService.updateBlockedUser(userId, blockedUser);
  }

  @UseGuards(AuthGuard())
  @Get(':userId')
  @ApiOperation({
    summary: 'Retorna um usuário pelo id',
  })
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  async getUserById(@Param('userId') userId: string) {
    return await this.userService.getUserById(userId);
  }

  @UseGuards(AuthGuard())
  @Get()
  @ApiOperation({
    summary: 'Retorna todos usuários',
  })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'phone', required: false })
  @ApiOkResponse({ type: GetAllUsersResponseDto })
  async getAllUsers(
    @Query('take') take = 10,
    @Query('skip') skip = 0,
    @Query('userId') userId?: string,
    @Query('search') search?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
  ) {
    return await this.userService.getAllUsers(
      take,
      skip,
      userId,
      search,
      email,
      phone,
    );
  }

  @UseGuards(AuthGuard())
  @Delete(':userId')
  @ApiOperation({
    summary: 'Exclui um usuário',
  })
  @ApiOkResponse({ type: DeleteResponseDto })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  async deleteUserById(@Param('userId') userId: string) {
    return { message: await this.userService.deleteUser(userId) };
  }
}
