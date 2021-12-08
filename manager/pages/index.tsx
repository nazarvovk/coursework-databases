import {
  Accordion,
  Button,
  Container,
  SimpleGrid,
  Space,
  Title,
  Text,
  Select,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { PromisedDatabase } from 'promised-sqlite3';
import { useState } from 'react';
import { DateTime } from 'luxon';
import { Customer, Order, Item } from './entities';
import axios from 'axios';

export const ORDER_STATUS_START = 'Замовлено';
export const ORDER_STATUS_DONE = 'Доставлено';
export const ORDER_STATUS_OPTIONS = [
  ORDER_STATUS_START,
  'Готується',
  "Очікує передачі кур'єру",
  'Доставляється',
  ORDER_STATUS_DONE,
];

export async function getStaticProps() {
  const db = new PromisedDatabase();
  await db.open('../database.db');

  const orders = await db.all(
    `SELECT * FROM "Order" o 
    join "Customer" c on c.phone=o.customerPhone;
    `
  );
  const customers = await db.all('SELECT * FROM "Customer";');
  const items = await db.all('SELECT * FROM "Item";');

  return {
    props: {
      orders,
      customers,
      items,
    },
  };
}

const Order = ({ order }: { order: Order }) => {
  const [opened, setOpened] = useState(true);
  const router = useRouter();

  const statuses = Array.from(new Set([...ORDER_STATUS_OPTIONS, order.status]));

  return (
    <Accordion.Item
      label={`${order.name} - ${order.createdTime}`}
      opened={opened}
      onToggle={() => setOpened((prev) => !prev)}
    >
      <Text>ID: {order.id}</Text>
      <Select
        label='Статус'
        placeholder='Оберіть'
        data={statuses}
        value={order.status}
        creatable
        searchable
        getCreateLabel={(query) => query}
        onChange={async (status) => {
          if (!status) return;
          await axios.post('/api/order/update-status', {
            status,
            orderId: order.id,
          });

          router.reload();
        }}
      />
      <Space />
      <Text>Вартість: {order.price}</Text>
      {order.deliveryTime && (
        <Text>Доставлено: {order.deliveryTime.toISO()}</Text>
      )}
    </Accordion.Item>
  );
};

type HomeProps = {
  customers: Customer[];
  orders: Order[];
  items: Item[];
};

export const Home = (props: HomeProps): React.ReactElement => {
  const { customers, items } = props;

  const orders: Order[] = props.orders.map((o: any) => ({
    ...o,
    createdTime: DateTime.fromMillis(o.createdTime),
    deliveryTime: o.deliveryTime
      ? DateTime.fromMillis(o.deliveryTime)
      : undefined,
  }));

  return (
    <Container fluid>
      <Space />
      <Title order={3}>Пекарня</Title>
      <Space />
      <SimpleGrid cols={3}>
        <div>
          <SimpleGrid cols={2}>
            <Title order={4}>Клієнти</Title>
            <Container>
              <Button component='a' href='/new-customer'>
                + Новий клієнт
              </Button>
            </Container>
          </SimpleGrid>
          <Space />
          <SimpleGrid>
            <Accordion>
              {customers.map((customer) => (
                <Accordion.Item key={customer.phone} label={customer.name}>
                  <Text>Телефон: {customer.phone}</Text>
                </Accordion.Item>
              ))}
            </Accordion>
          </SimpleGrid>
        </div>
        <div>
          <SimpleGrid cols={2}>
            <Title order={4}>Продукція</Title>
            <Container>
              <Button component='a' href='/new-item'>
                + Додати товар
              </Button>
            </Container>
          </SimpleGrid>
          <Space />
          <SimpleGrid>
            <Accordion>
              {items.map((item) => (
                <Accordion.Item key={item.id} label={item.name}>
                  <Text>Ціна: {item.price}</Text>
                  <Text>Опис: {item.description}</Text>
                </Accordion.Item>
              ))}
            </Accordion>
          </SimpleGrid>
        </div>
        <div>
          <SimpleGrid cols={2}>
            <Title order={4}>Замовлення</Title>
            <Container>
              <Button component='a' href='/new-order'>
                + Нове замовлення
              </Button>
            </Container>
          </SimpleGrid>
          <Space />
          <SimpleGrid>
            {orders.map((order) => (
              <Order key={order.id} order={order} />
            ))}
          </SimpleGrid>
        </div>
      </SimpleGrid>
    </Container>
  );
};
export default Home;
