import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateMenuOptionsDto, CreateMenusDto, CreateRestaurantsDto } from './dto/create-restaurants.dto';
import { UpdateMenuOptionsDto, UpdateMenusDto, UpdateRestaurantsDto } from './dto/update-restaurants.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Restaurant } from './schemas/restaurants.schema';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserRole } from 'src/auth/schemas/user.schema';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Controller('restaurants')
@ApiTags('매장 API')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RestaurantsController {
  constructor(
    private readonly restaurantService: RestaurantsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @ApiOperation({
    summary: '매장 목록 조회',
    description: '매장 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '매장 목록 조회 성공',
    type: [Restaurant],
  })
  @Get()
  async findAll(): Promise<Restaurant[]> {
    return await this.restaurantService.findAll();
  }
  @ApiOperation({
    summary: '매장 상세 조회',
    description: '매장 상세 정보를 조회합니다.',
  })
  @ApiOkResponse({
    description: '매장 상세 조회 성공',
    type: Restaurant,
  })
  @Get(':id')
  async findOneRestaurant(@Param('id') id: string): Promise<Restaurant> {
    const savedRestaurant: Restaurant = await this.cacheManager.get(id);
    if (savedRestaurant) {
      return savedRestaurant;
    }
    const restaurant = await this.restaurantService.findOne(id);
    await this.cacheManager.set(id, restaurant, 60 * 60 * 24);
    return restaurant;
  }

  @Patch(':id/status')
  async changeStatus(@Param('id') id: string, @Query('status') status: number) {
    const savedRestaurant: Restaurant = await this.cacheManager.get(id);

    const restaurant = await this.restaurantService.changeStatus(id, status);

    if (savedRestaurant) {
      await this.cacheManager.set(id, restaurant, 60 * 60 * 24);
    }

    return restaurant;
  }

  @ApiOperation({
    summary: '매장 생성',
    description: '매장을 생성합니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '매장 생성 정보',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        en_name: {
          type: 'string',
        },
        category: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        intro: {
          type: 'string',
        },
        notice: {
          type: 'string',
        },
        phone_number: {
          type: 'string',
        },
        banner_images: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        address: {
          type: 'string',
        },
        created_at: {
          type: 'Date',
        },
        updated_at: {
          type: 'Date',
        },
        status: {
          type: 'number',
        },
        menu: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        image: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: '매장 생성 성공',
    type: Restaurant,
  })
  @ApiBearerAuth('access-token')
  @Roles(UserRole.RESTAURANT_MANAGER)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 10 }]))
  @Post()
  async createRestaurant(@Body() data: any, @UploadedFiles() files: Express.Multer.File[]): Promise<Restaurant> {
    const createRestaurantsDto: CreateRestaurantsDto = JSON.parse(data.createRestaurantsDto);

    return await this.restaurantService.createRestaurant(createRestaurantsDto, files);
  }

  @ApiOperation({
    summary: '매장 수정',
    description: '매장을 수정합니다.',
  })
  @ApiResponse({ status: HttpStatus.OK, description: '매장 수정 성공', type: Restaurant })
  @ApiBody({
    description: '매장 수정 정보',
    type: UpdateRestaurantsDto,
  })
  @ApiBearerAuth('access-token')
  @Roles(UserRole.RESTAURANT_MANAGER)
  @Patch(':id')
  async updateRestaurant(
    @Param('id') id: string,
    @Body() updateRestaurantsDto: UpdateRestaurantsDto,
  ): Promise<Restaurant> {
    const restaurant = this.restaurantService.update(id, updateRestaurantsDto);
    const savedRestaurant: Restaurant = await this.cacheManager.get(id);
    if (savedRestaurant) {
      savedRestaurant.name = updateRestaurantsDto.name;
      savedRestaurant.phone_number = updateRestaurantsDto.phone_number;
      savedRestaurant.address = updateRestaurantsDto.address;
      savedRestaurant.intro = updateRestaurantsDto.intro;
      if (Array.isArray(updateRestaurantsDto.banner_images) && updateRestaurantsDto.banner_images.length > 0)
        savedRestaurant.banner_images = updateRestaurantsDto.banner_images;

      await this.cacheManager.set(id, savedRestaurant, 60 * 60 * 24);
    }

    return restaurant;
  }

  @ApiOperation({
    summary: '매장 배너 이미지 추가',
    description: '매장 배너 이미지를 추가합니다.',
  })
  @ApiBearerAuth('access-token')
  @Roles(UserRole.RESTAURANT_MANAGER)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 6 }]))
  @Patch(':id/images')
  async uploadRestaurantBannerImage(@Param('id') _id: string, @UploadedFiles() files: Express.Multer.File[]) {
    return await this.restaurantService.addRestaurantBannerImage(_id, files);
  }

  @ApiOperation({
    summary: '매장 메뉴 이미지 추가',
    description: '매장 메뉴 이미지를 추가합니다.',
  })
  @ApiBearerAuth('access-token')
  @Roles(UserRole.RESTAURANT_MANAGER)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @Patch(':id/menus/images')
  async uploadMenuImage(@Param('id') _id: string, @UploadedFiles() files: Express.Multer.File[]) {
    return await this.restaurantService.addMenuImage(_id, files);
  }

  @ApiOperation({
    summary: '매장 배너 이미지 삭제',
    description: '매장 배너 이미지를 삭제합니다.',
  })
  @ApiBearerAuth('access-token')
  @Roles(UserRole.RESTAURANT_MANAGER)
  @Delete(':id/images/:imageId')
  async deleteImage(@Param('id') id: string, @Param('imageId') imageName: string) {
    return await this.restaurantService.deleteImage(id, imageName);
  }

  @ApiOperation({
    summary: '매장 메뉴 추가',
    description: '매장 메뉴를 추가합니다.',
  })
  @ApiBody({
    description: '매장 메뉴 추가 정보',
    type: CreateMenusDto,
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: '매장 메뉴 추가 성공', type: Restaurant })
  @ApiBearerAuth('access-token')
  @Roles(UserRole.RESTAURANT_MANAGER)
  @Post(':id/menus')
  async addMenu(@Param('id') id: string, @Body() createMenusDto: CreateMenusDto) {
    const savedRestaurant: Restaurant = await this.cacheManager.get(id);

    const restaurant = await this.restaurantService.addMenu(id, createMenusDto);

    if (savedRestaurant) {
      await this.cacheManager.set(id, restaurant, 60 * 60 * 24);
    }

    return restaurant;
  }

  @ApiOperation({
    summary: '매장 메뉴 수정',
    description: '매장 메뉴를 수정합니다.',
  })
  @ApiBody({
    description: '매장 메뉴 수정 정보',
    type: UpdateMenusDto,
  })
  @ApiResponse({ status: HttpStatus.OK, description: '매장 메뉴 수정 성공', type: Restaurant })
  @ApiBearerAuth('access-token')
  @Roles(UserRole.RESTAURANT_MANAGER)
  @Patch(':id/menus')
  async updateMenu(@Param('id') id: string, @Body() updateMenusDto: UpdateMenusDto) {
    const savedRestaurant: Restaurant = await this.cacheManager.get(id);

    const restaurant = await this.restaurantService.updateMenu(id, updateMenusDto);

    if (savedRestaurant) {
      await this.cacheManager.set(id, restaurant, 60 * 60 * 24);
    }

    return restaurant;
  }

  @ApiOperation({
    summary: '매장 메뉴 삭제',
    description: '매장 메뉴를 삭제합니다.',
  })
  @ApiResponse({ status: HttpStatus.OK, description: '매장 메뉴 삭제 성공', type: Restaurant })
  @ApiBearerAuth('access-token')
  @Roles(UserRole.RESTAURANT_MANAGER)
  @Delete(':id/menus/:menuId')
  async deleteMenu(@Param('id') id: string, @Param('menuId') menuId: string) {
    const savedRestaurant: Restaurant = await this.cacheManager.get(id);

    const restaurant = await this.restaurantService.deleteMenu(id, menuId);

    if (savedRestaurant) {
      await this.cacheManager.del(id);
    }

    return restaurant;
  }

  @ApiOperation({
    summary: '매장 삭제',
    description: '매장을 삭제합니다.',
  })
  @ApiResponse({ status: HttpStatus.OK, description: '매장 삭제 성공', type: String })
  @ApiBearerAuth('access-token')
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.restaurantService.remove(id);
  }

  @ApiOperation({
    summary: '매장 메뉴 옵션 추가',
    description: '매장 메뉴 옵션을 추가합니다.',
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: '매장 메뉴 옵션 추가 성공', type: Restaurant })
  @ApiBody({
    description: '매장 메뉴 옵션 추가 정보',
    type: CreateMenuOptionsDto,
  })
  @ApiBearerAuth('access-token')
  @Roles(UserRole.RESTAURANT_MANAGER)
  @Post(':id/menus/:menuId/options')
  async addMenuOption(@Param('id') id: string, @Param('menuId') menuId: string, @Body() data: any) {
    const createMenuOptionsDto: CreateMenuOptionsDto = JSON.parse(data.createMenuOptionsDto);
    return await this.restaurantService.addMenuOption(id, menuId, createMenuOptionsDto);
  }

  @ApiOperation({
    summary: '매장 메뉴 옵션 수정',
    description: '매장 메뉴 옵션을 수정합니다.',
  })
  @ApiResponse({ status: HttpStatus.OK, description: '매장 메뉴 옵션 수정 성공', type: Restaurant })
  @ApiBody({
    description: '매장 메뉴 옵션 수정 정보',
    type: UpdateMenuOptionsDto,
  })
  @ApiBearerAuth('access-token')
  @Roles(UserRole.RESTAURANT_MANAGER)
  @Patch(':id/menus/:menuId/options')
  async updateMenuOption(@Param('id') id: string, @Param('menuId') menuId: string, @Body() data: any) {
    const updateMenuOptionsDto: UpdateMenuOptionsDto = JSON.parse(data.updateMenuOptionsDto);
    return await this.restaurantService.updateMenuOption(id, menuId, updateMenuOptionsDto);
  }

  @ApiOperation({
    summary: '매장 메뉴 옵션 삭제',
    description: '매장 메뉴 옵션을 삭제합니다.',
  })
  @ApiResponse({ status: HttpStatus.OK, description: '매장 메뉴 옵션 삭제 성공', type: Restaurant })
  @ApiBearerAuth('access-token')
  @Roles(UserRole.RESTAURANT_MANAGER)
  @Delete(':id/menus/:menuId/options/:optionId')
  async deleteMenuOption(
    @Param('id') id: string,
    @Param('menuId') menuId: string,
    @Param('optionId') optionId: string,
  ) {
    return await this.restaurantService.deleteMenuOption(id, menuId, optionId);
  }

  @ApiOperation({
    summary: '매장 카테고리 추가',
    description: '매장 카테고리를 추가합니다.',
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: '매장 카테고리 추가 성공', type: Restaurant })
  @ApiBearerAuth('access-token')
  @Roles(UserRole.RESTAURANT_MANAGER)
  @Post(':id/categories')
  async addCategory(@Param('id') id: string, @Query('category') category: string) {
    const savedRestaurant: Restaurant = await this.cacheManager.get(id);

    const restaurant = await this.restaurantService.addCategory(id, category);
    if (savedRestaurant) {
      await this.cacheManager.set(id, restaurant, 60 * 60 * 24);
    }
    return restaurant;
  }
}
