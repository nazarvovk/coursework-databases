import { DateTime } from 'luxon';

export type OrderDBRow = {
  id: string;
  createdTime: number;
  deliveryTime: number;
  customerPhone: string;
  status: string;
};

export type Order = {
  id: string;
  createdTime: DateTime;
  deliveryTime: DateTime;
  customerPhone: string;
  name: string;
  status: string;
  price: number
};

export type CreateOrderInput = {
  customerPhone: string;
  name: string;
  status: string;
  address: string;
  items: OrderItem[]
};

export type Customer = {
  name: string
  phone: string
}

export type Item = {
  id: string
  name: string
  price: number
  description: string
}

export type OrderItem = {
  itemId: string
  quantity: number
  price: number
}
