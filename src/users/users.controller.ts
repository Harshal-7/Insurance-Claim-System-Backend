import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async create(@Body() user: Partial<User>): Promise<User> {
    return await this.usersService.create(user);
  }

  @Get('users')
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('users/:id')
  async findOne(@Param('id') id: number): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Put('users/:id')
  async update(
    @Param('id') id: number,
    @Body() updates: Partial<User>,
  ): Promise<User> {
    return await this.usersService.update(id, updates);
  }

  @Delete('users/:id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.usersService.delete(id);
  }
}
