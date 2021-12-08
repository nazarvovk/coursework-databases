import type { NextApiRequest, NextApiResponse } from 'next'
import { PromisedDatabase } from 'promised-sqlite3';
import { CreateOrderInput } from '../../entities';
import { v4 } from 'uuid';

type ReqBody = {
  values: CreateOrderInput
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = new PromisedDatabase();
  await db.open('../database.db');

  const { values: order }: ReqBody = req.body

  const orderId = v4()

  await db.all(
    `insert into "Order"  (
      id,
      status,
      createdTime,
      customerPhone,
      address,
      price
    )
    values (
      ?,?,?,?,?,?
    );`,
    orderId,
    order.status,
    Date.now(),
    order.customerPhone,
    order.address,
    order.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );


  for await (const item of order.items) {
    await db.all(
      `insert into "OrderItem"  (
        id,
        itemId,
        quantity,
        price,
        orderId
      )
      values (
        ?,?,?,?,?
      );`,
      v4(),
      item.itemId,
      item.quantity,
      item.price,
      orderId
    );
  }

  res.status(200).send('')
}
