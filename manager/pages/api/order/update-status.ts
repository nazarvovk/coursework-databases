import type { NextApiRequest, NextApiResponse } from 'next'
import { PromisedDatabase } from 'promised-sqlite3';
import { ORDER_STATUS_DONE } from './../../index';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = new PromisedDatabase();
  await db.open('../database.db');

  const { body } = req

  await db.all(
    `update "Order" set status=? where id=?;`,
    body.status,
    body.orderId,
  );

  if (body.status === ORDER_STATUS_DONE) {
    await db.all(
      `update "Order" set deliveryTime=? where id=?;`,
      Date.now(),
      body.orderId,
    );
  }

  res.status(200).send('')
}
