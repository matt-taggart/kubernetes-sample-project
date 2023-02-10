import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateImageDto } from './dto/create-image.dto';
import { GetImagesDto } from './dto/get-images.dto';
import { SaveImageDto } from './dto/save-image.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'create-image' })
  createImage(createImageDto: CreateImageDto) {
    this.appService.createImage(createImageDto);
  }

  @MessagePattern({ cmd: 'get-images' })
  getImages(getImagesDto: GetImagesDto) {
    this.appService.getImages(getImagesDto);
  }

  @MessagePattern({ cmd: 'save-image' })
  saveImage(saveImageDto: SaveImageDto) {
    this.appService.saveImage(saveImageDto);
  }
}
