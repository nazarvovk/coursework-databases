import type { NextApiRequest, NextApiResponse } from 'next'
import { PromisedDatabase } from 'promised-sqlite3';
import { Customer } from '../../entities';

type ReqBody = {
  values: Customer
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = new PromisedDatabase();
  await db.open('../database.db');

  const { values } = req.body as ReqBody

  await db.all(
    `insert into "Customer"  (
      name,
      phone
    )
    values (?, ?);`,
    values.name,
    values.phone
  );

  res.status(200).send('')
}
