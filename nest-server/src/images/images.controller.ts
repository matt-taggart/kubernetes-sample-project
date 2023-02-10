import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { AuthGuard } from 'src/auth.guard';
import { AuthenticatedRequest } from 'src/types';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseGuards(new AuthGuard())
  createImage(
    @Body() createImageDto: CreateImageDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.imagesService.createImage(createImageDto, {
      userId: request.userId,
    });
  }

  @Post('webhook')
  webhook(@Req() request: AuthenticatedRequest) {
    const parsedBody = request.body;
    const generatedId = parsedBody.id;
    const image = parsedBody.output[0].image;
    const status = parsedBody.status;

    return this.imagesService.saveImage({
      generatedId,
      image,
      status,
    });
  }

  @Get()
  @UseGuards(new AuthGuard())
  getImages(@Req() request: AuthenticatedRequest) {
    return this.imagesService.getImages({ userId: request.userId });
  }
}
