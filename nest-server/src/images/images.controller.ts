import { Controller, Get, Post, Body } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';

@Controller('v1/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  create(@Body() createImageDto: CreateImageDto) {
    return this.imagesService.create(createImageDto);
  }

  @Post('webhook')
  webhook(@Body() webhookPayload: any) {
    return this.imagesService.webhook(webhookPayload);
  }

  @Get()
  findAll() {
    return this.imagesService.findAll();
  }
}
