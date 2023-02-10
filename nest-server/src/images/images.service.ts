import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, of } from 'rxjs';
import { CreateImageDto } from './dto/create-image.dto';
import { GetImagesDto } from './dto/get-images.dto';

@Injectable()
export class ImagesService {
  constructor(
    @Inject('IMAGES_MICROSERVICE') private readonly client: ClientProxy,
  ) {}

  createImage(createImageDto: CreateImageDto, { userId }) {
    return this.client
      .send({ cmd: 'create-image' }, { ...createImageDto, userId })
      .pipe(
        catchError((error) => {
          return of(error.response);
        }),
      );
  }

  saveImage(webhookPayload: any) {
    return this.client.send({ cmd: 'save-image' }, webhookPayload).pipe(
      catchError((error) => {
        return of(error.response);
      }),
    );
  }

  getImages(getImagesDto: GetImagesDto) {
    return this.client.send({ cmd: 'get-images' }, getImagesDto).pipe(
      catchError((error) => {
        return of(error.response);
      }),
    );
  }
}
