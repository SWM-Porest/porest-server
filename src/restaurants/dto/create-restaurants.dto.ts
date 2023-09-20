import { IsNotEmpty } from 'class-validator';
import { Date, Types } from 'mongoose';
import { Menu, MenuOption, Name, Item, Image } from '../schemas/restaurants.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRestaurantsDto {
  @ApiProperty({
    description: '매장 ID',
    required: false,
    default: undefined,
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: '매장 이름',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '매장 영문 이름',
    required: false,
  })
  en_name: string;

  @ApiProperty({
    description: '매장 카테고리',
    required: false,
  })
  category: string[];

  @ApiProperty({
    description: '매장 소개',
    required: false,
  })
  intro: string;

  @ApiProperty({
    description: '매장 공지',
    required: false,
  })
  notice: string;

  @ApiProperty({
    description: '매장 전화번호',
    required: false,
  })
  phone_number: string;

  @ApiProperty({
    description: '매장 배너 이미지',
    required: false,
  })
  banner_images: Image[];

  @ApiProperty({
    description: '매장 주소',
    required: false,
  })
  address: string;

  @ApiProperty({
    description: '매장 생성일',
    required: false,
  })
  created_at: Date;

  @ApiProperty({
    description: '매장 수정일',
    required: false,
  })
  updated_at: Date;

  @ApiProperty({
    description: '매장 상태',
    required: false,
  })
  status: number;

  @ApiProperty({
    description: '매장 메뉴',
    required: false,
    type: [Menu],
  })
  menus: Menu[];
}

export class CreateMenusDto {
  @ApiProperty({
    description: '메뉴 ID',
    required: false,
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: '메뉴 이름',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '메뉴 영문 이름',
    required: false,
  })
  en_name: string;

  @ApiProperty({
    description: '메뉴 카테고리',
    required: false,
  })
  category: string;

  @ApiProperty({
    description: '메뉴 타입',
    required: false,
  })
  menutype: string;

  @ApiProperty({
    description: '메뉴 설명',
    required: false,
  })
  description: string;

  @ApiProperty({
    description: '메뉴 이미지',
    required: false,
  })
  img: Image;

  @ApiProperty({
    description: '메뉴 가격',
  })
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: '품절 여부',
    required: false,
  })
  isSoldOut: boolean;

  @ApiProperty({
    description: '메뉴 옵션',
    required: false,
  })
  menuOptions: MenuOption[];

  @ApiProperty({
    description: '메뉴 생성일',
    required: false,
  })
  created_at: Date;

  @ApiProperty({
    description: '메뉴 수정일',
    required: false,
  })
  updated_at: Date;
}

export class CreateMenuOptionsDto {
  @ApiProperty({
    description: '메뉴 옵션 ID',
    required: false,
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: '메뉴 옵션 이름',
  })
  @IsNotEmpty()
  name: Name;

  @ApiProperty({
    description: '메뉴 옵션 생성일',
    required: false,
  })
  created_at: Date;

  @ApiProperty({
    description: '메뉴 옵션 수정일',
    required: false,
  })
  updated_at: Date;

  @ApiProperty({
    description: '품절 여부',
    default: false,
  })
  isSoldOut: boolean;

  @ApiProperty({
    description: '메뉴 옵션 최대 선택 개수',
    default: 1,
  })
  maxSelect: number;

  @ApiProperty({
    description: '메뉴 옵션 항목',
    required: false,
    type: [Object],
  })
  items: Item[];
}
