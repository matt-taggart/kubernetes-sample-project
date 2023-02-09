import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { GreetingsService } from './greetings.service';
import { CreateGreetingDto } from './dto/create-greeting.dto';

@Controller('v1/greetings')
export class GreetingsController {
  constructor(private readonly greetingsService: GreetingsService) {}

  @Post()
  create(@Body() createGreetingDto: CreateGreetingDto) {
    return this.greetingsService.create(createGreetingDto);
  }

  @Get()
  findAll() {
    return this.greetingsService.findAll();
  }

  @Delete()
  remove(@Param('id') id: string) {
    return this.greetingsService.remove(id);
  }
}
