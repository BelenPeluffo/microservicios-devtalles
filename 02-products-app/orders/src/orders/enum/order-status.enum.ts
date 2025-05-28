import { OrderStatus } from 'generated/prisma/client';

export const orderStatus = [
  OrderStatus.PENDING,
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
];
