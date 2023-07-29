import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenusDto, CreateRestaurantsDto } from './dto/create-restaurants.dto';
import { UpdateRestaurantsDto } from './dto/update-restaurants.dto';
import { Types } from 'mongoose';
import { RestaurantRepository } from './restaurants.repository';
import { Restaurant } from './schemas/restaurants.schema';
import { ImageUploadService } from '../common/uploader/image-upload.service';
import { UPLOAD_TYPE } from '../common/uploader/upload-type';

@Injectable()
export class RestaurantsService {
  constructor(
    private readonly restaurantRepository: RestaurantRepository,
    private readonly imageUploadService: ImageUploadService,
  ) {}

  async createRestaurant(createRestaurantsDto: CreateRestaurantsDto, files: Express.Multer.File[]) {
    const { name } = createRestaurantsDto;

    if (await this.restaurantRepository.isExistRestaurant(name)) {
      throw new HttpException('Name is Duplicated', HttpStatus.CONFLICT);
    }

    const bannerImageUrls = await this.imageUploadService.uploadImage(files['image'], UPLOAD_TYPE.RESTAURANT_BANNER);
    createRestaurantsDto.banner_image_urls = bannerImageUrls;

    return this.restaurantRepository.createRestaurant(createRestaurantsDto);
  }

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantRepository.findAll();
  }

  async findOne(_id: string): Promise<Restaurant> {
    if (Types.ObjectId.isValid(_id)) {
      const findRestaurant: Restaurant = await this.restaurantRepository.findOneRestaurant(_id);
      if (findRestaurant) {
        return findRestaurant;
      } else {
        throw new NotFoundException(`Not exist ${_id}`);
      }
    } else {
      throw new NotFoundException('Invalid ID');
    }
  }

  async update(_id: string, updateRestaurantsDto: UpdateRestaurantsDto, files: Express.Multer.File[]) {
    const banner_image_urls = await this.imageUploadService.uploadImage(files['image'], UPLOAD_TYPE.RESTAURANT_BANNER);

    if (banner_image_urls.length > 0) {
      updateRestaurantsDto.banner_image_urls = banner_image_urls;
    }

    return this.restaurantRepository.updateRestaurant(_id, updateRestaurantsDto);
  }

  async addMenu(_id: string, createMenusDto: CreateMenusDto, files: Express.Multer.File[]): Promise<Restaurant> {
    const restaurant: Restaurant = await this.findOne(_id);

    if (!restaurant) {
      throw new NotFoundException(`Not Found Restaurant by id${_id}`);
    }

    const image_urls = await this.imageUploadService.uploadImage(files['image'], UPLOAD_TYPE.MENU);
    createMenusDto.img = image_urls.length > 0 ? image_urls[0] : '';

    return await this.restaurantRepository.addMenu(_id, createMenusDto);
  }

  remove(_id: string) {
    return `Remove Restaurant with id${_id}`;
  }
}
