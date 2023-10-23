import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateMenuOptionsDto, CreateMenusDto, CreateRestaurantsDto } from './dto/create-restaurants.dto';
import { UpdateMenuOptionsDto, UpdateMenusDto, UpdateRestaurantsDto } from './dto/update-restaurants.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Restaurant } from './schemas/restaurants.schema';
import {
  ApiBasicAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Http } from 'winston/lib/winston/transports';

@Controller('restaurants')
@ApiTags('매장 API')
export class RestaurantsController {
  constructor(private readonly restaurantService: RestaurantsService) {}

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
    return await this.restaurantService.findOne(id);
  }

  @ApiOperation({
    summary: '매장 생성',
    description: '매장을 생성합니다.',
  })
  @ApiBasicAuth()
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
  @UseGuards(AuthGuard('basic'))
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
  @UseGuards(AuthGuard('basic'))
  @Patch(':id')
  async updateRestaurant(
    @Param('id') id: string,
    @Body() updateRestaurantsDto: UpdateRestaurantsDto,
  ): Promise<Restaurant> {
    return this.restaurantService.update(id, updateRestaurantsDto);
  }

  @ApiOperation({
    summary: '매장 배너 이미지 추가',
    description: '매장 배너 이미지를 추가합니다.',
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 6 }]))
  @UseGuards(AuthGuard('basic'))
  @Patch(':id/images')
  async uploadRestaurantBannerImage(@Param('id') _id: string, @UploadedFiles() files: Express.Multer.File[]) {
    return await this.restaurantService.addRestaurantBannerImage(_id, files);
  }

  @ApiOperation({
    summary: '매장 메뉴 이미지 추가',
    description: '매장 메뉴 이미지를 추가합니다.',
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @Patch(':id/menus/images')
  async uploadMenuImage(@Param('id') _id: string, @UploadedFiles() files: Express.Multer.File[]) {
    return await this.restaurantService.addMenuImage(_id, files);
  }

  @ApiOperation({
    summary: '매장 배너 이미지 삭제',
    description: '매장 배너 이미지를 삭제합니다.',
  })
  @UseGuards(AuthGuard('basic'))
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
  @Post(':id/menus')
  async addMenu(@Param('id') id: string, @Body() createMenusDto: CreateMenusDto) {
    return await this.restaurantService.addMenu(id, createMenusDto);
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
  @Patch(':id/menus')
  async updateMenu(@Param('id') id: string, @Body() updateMenusDto: UpdateMenusDto) {
    return await this.restaurantService.updateMenu(id, updateMenusDto);
  }

  @ApiOperation({
    summary: '매장 메뉴 삭제',
    description: '매장 메뉴를 삭제합니다.',
  })
  @ApiResponse({ status: HttpStatus.OK, description: '매장 메뉴 삭제 성공', type: Restaurant })
  @UseGuards(AuthGuard('basic'))
  @Delete(':id/menus/:menuId')
  async deleteMenu(@Param('id') id: string, @Param('menuId') menuId: string) {
    return await this.restaurantService.deleteMenu(id, menuId);
  }

  @ApiOperation({
    summary: '매장 삭제',
    description: '매장을 삭제합니다.',
  })
  @ApiResponse({ status: HttpStatus.OK, description: '매장 삭제 성공', type: String })
  @UseGuards(AuthGuard('basic'))
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
  @UseGuards(AuthGuard('basic'))
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
  @UseGuards(AuthGuard('basic'))
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
  @UseGuards(AuthGuard('basic'))
  @Delete(':id/menus/:menuId/options/:optionId')
  async deleteMenuOption(
    @Param('id') id: string,
    @Param('menuId') menuId: string,
    @Param('optionId') optionId: string,
  ) {
    return await this.restaurantService.deleteMenuOption(id, menuId, optionId);
  }
}
