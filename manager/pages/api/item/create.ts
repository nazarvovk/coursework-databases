import type { NextApiRequest, NextApiResponse } from 'next'
import { PromisedDatabase } from 'promised-sqlite3';
import { Item } from '../../entities';
import { v4 } from 'uuid'

type ReqBody = {
  values: Item
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = new PromisedDatabase();
  await db.open('../database.db');

  const { values } = req.body as ReqBody

  await db.all(
    `insert into "Item"  (
      id,name,price,description
    )
    values (?, ?, ?, ?);`,
    v4(),
    values.name,
    values.price,
    values.description,
  );

  res.status(200).send('')
}
