import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMenuOptionsDto, CreateMenusDto, CreateRestaurantsDto } from './dto/create-restaurants.dto';
import { UpdateMenuOptionsDto, UpdateMenusDto, UpdateRestaurantsDto } from './dto/update-restaurants.dto';
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

    const bannerImages = await this.imageUploadService.uploadImage(files['image'], UPLOAD_TYPE.RESTAURANT_BANNER);
    createRestaurantsDto.banner_images = bannerImages;

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

  async update(_id: string, updateRestaurantsDto: UpdateRestaurantsDto) {
    // TODO: 이름 정책 어떻게 할 건지
    // if (await this.restaurantRepository.isExistRestaurant(updateRestaurantsDto.name)) {
    //   throw new HttpException('Name is Duplicated', HttpStatus.CONFLICT);
    // }

    return this.restaurantRepository.updateRestaurant(_id, updateRestaurantsDto);
  }

  async addRestaurantBannerImage(_id: string, files: Express.Multer.File[]): Promise<Restaurant> {
    const new_banner_images = await this.imageUploadService.uploadImage(files['image'], UPLOAD_TYPE.RESTAURANT_BANNER);

    return this.restaurantRepository.addRestaurantBannerImage(_id, new_banner_images);
  }

  async deleteImage(_id: string, imageName: string): Promise<Restaurant> {
    return this.restaurantRepository.deleteImage(_id, imageName);
  }
  async addMenu(_id: string, createMenusDto: CreateMenusDto, files: Express.Multer.File[]): Promise<Restaurant> {
    const restaurant: Restaurant = await this.findOne(_id);

    if (!restaurant) {
      throw new NotFoundException(`Not Found Restaurant by id${_id}`);
    }

    const images = await this.imageUploadService.uploadImage(files['image'], UPLOAD_TYPE.MENU);
    createMenusDto.img = images.length > 0 ? images[0] : null;

    return await this.restaurantRepository.addMenu(_id, createMenusDto);
  }

  async updateMenu(_id: string, updateMenusDto: UpdateMenusDto, files: Express.Multer.File[]) {
    const restaurant: Restaurant = await this.findOne(_id);

    if (!restaurant) {
      throw new NotFoundException(`Not Found Restaurant by id${_id}`);
    }

    if (files['image'] && files['image'].length > 0) {
      await Promise.all(
        files['image'].map(async (file, index) => {
          if (file.mimetype === 'application/octet-stream') {
            return updateMenusDto.img;
          }
          const images = await this.imageUploadService.uploadImage(files['image'], UPLOAD_TYPE.MENU);

          updateMenusDto.img = images.length > 0 ? images[0] : null;
        }),
      );
    }

    return await this.restaurantRepository.updateMenu(_id, updateMenusDto);
  }

  async deleteMenu(_id: string, menuId: string) {
    const restaurant: Restaurant = await this.findOne(_id);

    if (!restaurant) {
      throw new NotFoundException(`Not Found Restaurant by id${_id}`);
    }

    return await this.restaurantRepository.deleteMenu(_id, menuId);
  }

  async addMenuOption(_id: string, menuId: string, createMenuOptionsDto: CreateMenuOptionsDto): Promise<Restaurant> {
    const restaurant: Restaurant = await this.findOne(_id);

    if (!restaurant) {
      throw new NotFoundException(`Not Found Restaurant by id${_id}`);
    }

    return await this.restaurantRepository.addMenuOption(_id, menuId, createMenuOptionsDto);
  }

  async updateMenuOption(_id: string, menuId: string, updateMenuOptionDto: UpdateMenuOptionsDto): Promise<Restaurant> {
    const restaurant: Restaurant = await this.findOne(_id);

    if (!restaurant) {
      throw new NotFoundException(`Not Found Restaurant by id${_id}`);
    }

    return await this.restaurantRepository.updateMenuOption(_id, menuId, updateMenuOptionDto);
  }

  async deleteMenuOption(_id: string, menuId: string, menuOptionId: string): Promise<Restaurant> {
    const restaurant: Restaurant = await this.findOne(_id);

    if (!restaurant) {
      throw new NotFoundException(`Not Found Restaurant by id${_id}`);
    }

    return await this.restaurantRepository.deleteMenuOption(_id, menuId, menuOptionId);
  }

  remove(_id: string) {
    return `Remove Restaurant with id${_id}`;
  }
}
