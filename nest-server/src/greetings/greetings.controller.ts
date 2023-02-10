import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { GreetingsService } from './greetings.service';
import { CreateGreetingDto } from './dto/create-greeting.dto';
import { AuthGuard } from 'src/auth.guard';
import { AuthenticatedRequest } from 'src/types';

@Controller('greetings')
export class GreetingsController {
  constructor(private readonly greetingsService: GreetingsService) {}

  @Post()
  @UseGuards(new AuthGuard())
  createGreeting(
    @Body() createGreetingDto: CreateGreetingDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.greetingsService.createGreeting({
      userId: request.userId,
      prompt: createGreetingDto.prompt,
    });
  }

  @Get()
  @UseGuards(new AuthGuard())
  getGreetings(@Req() request: AuthenticatedRequest) {
    return this.greetingsService.getGreetings({ userId: request.userId });
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(new AuthGuard())
  removeGreeting(@Param('id') id: string) {
    return this.greetingsService.removeGreeting({ id });
  }
}
