import { IsNotEmpty } from 'class-validator';

export class PushSubscriptionDto {
  @IsNotEmpty()
  endpoint: string;

  @IsNotEmpty()
  keys: {
    auth: string;
    p256dh: string;
  };

  expirationTime: number | null;
}

export enum OrderStatusMessage {
  'undefined',
  '현재 주문을 확인하고 있습니다.',
  '현재 주문이 조리 중입니다.',
  '주문하신 메뉴가 준비되었습니다.',
  '즐거운 식사 되세요!',
  '감사합니다. 다음에 또 방문해주세요!',
}
