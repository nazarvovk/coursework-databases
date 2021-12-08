import {
  Button,
  Container,
  Space,
  Title,
  TextInput,
  Select,
  Card,
  Text,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import axios from 'axios';
import assert from 'assert';
import { useRouter } from 'next/router';
import { PromisedDatabase } from 'promised-sqlite3';
import { Customer, Item, OrderItem } from './entities';
import { ORDER_STATUS_START, ORDER_STATUS_OPTIONS } from './index';

export async function getStaticProps() {
  const db = new PromisedDatabase();
  await db.open('../database.db');

  const customers = await db.all('SELECT * FROM "Customer";');
  const items = await db.all('SELECT * FROM "Item";');

  return {
    props: {
      customers,
      items,
    },
  };
}
type NewOrderProps = {
  customers: Customer[];
  items: Item[];
};

export const NewOrder = (props: NewOrderProps): React.ReactElement => {
  const router = useRouter();

  const { customers, items: allItems } = props;

  const form = useForm({
    initialValues: {
      customerPhone: '',
      status: ORDER_STATUS_START,
      items: [] as OrderItem[],
      address: '',
    },
    validationRules: {
      customerPhone: (value) => !!customers.find((c) => c.phone == value),
      address: (value) => !!value,
      items: (value) => value.length > 0,
    },
  });

  const addItem = (itemId: string) => {
    const item = allItems.find((i) => i.id === itemId);
    assert(item);

    const newItems: OrderItem[] = [
      ...form.values.items,
      {
        itemId,
        quantity: 1,
        price: item.price,
      },
    ];

    form.setFieldValue('items', newItems);
  };

  const Items = () => (
    <Container>
      <Title order={5}>Товари</Title>

      {form.values.items.map((orderItem) => {
        const item = allItems.find((i) => i.id === orderItem.itemId);
        assert(item);

        const deleteItem = () => {
          const newItems = form.values.items.filter(
            (i) => i.itemId !== orderItem.itemId
          );

          form.setFieldValue('items', newItems);
        };

        const changeItemQuantity = (e: any) => {
          const newItems = form.values.items.map((item) =>
            item.itemId === orderItem.itemId
              ? {
                  ...item,
                  quantity: e.target.value,
                }
              : item
          );
          form.setFieldValue('items', newItems);
        };

        const changeItemPrice = (e: any) => {
          const newItems = form.values.items.map((item) =>
            item.itemId === orderItem.itemId
              ? {
                  ...item,
                  price: e.target.value,
                }
              : item
          );
          form.setFieldValue('items', newItems);
        };

        return (
          <Card shadow='md' key={orderItem.itemId}>
            <Title order={6}>{item.name}</Title>
            <Text>{item.description}</Text>
            <Space />
            <TextInput
              required
              type='number'
              value={orderItem.quantity}
              label='Кількість'
              placeholder='Кількість'
              onChange={changeItemQuantity}
            />
            <Space />
            <TextInput
              required
              type='number'
              value={orderItem.price}
              label='Ціна'
              placeholder='Ціна'
              onChange={changeItemPrice}
            />
            <Space />
            Вартість: {orderItem.price * orderItem.quantity}
            <Space />
            <Button color='red' onClick={deleteItem}>
              Видалити товар
            </Button>
          </Card>
        );
      })}
    </Container>
  );

  return (
    <Container>
      <Space />
      <Title order={3}>Нове Замовлення</Title>
      <Space />
      <form
        onSubmit={form.onSubmit(async (values) => {
          await axios.post('/api/order/create', {
            values,
          });

          await router.push('/');
        })}
      >
        <Select
          label='Клієнт'
          data={customers.map((c) => ({
            value: c.phone,
            label: `${c.name} (${c.phone})`,
          }))}
          searchable
          getCreateLabel={(query) => query}
          onChange={(val) => form.setFieldValue('customerPhone', val ?? '')}
          value={form.values.customerPhone}
          error={form.errors.customerPhone}
        />
        <Space />
        <Select
          label='Статус'
          data={ORDER_STATUS_OPTIONS}
          getCreateLabel={(query) => query}
          onChange={(val) => form.setFieldValue('status', val ?? '')}
          value={form.values.status}
          error={form.errors.status}
        />
        <Space />
        <Textarea placeholder='Адреса доставки' {...form.getInputProps('address')} />
        <Space />
        <Select
          label='Додати товар'
          placeholder='Клацніть щоб обрати'
          data={allItems
            .filter(
              (i) =>
                !form.values.items.map(({ itemId }) => itemId).includes(i.id)
            )
            .map((i) => ({
              value: i.id,
              label: i.name,
            }))}
          searchable
          getCreateLabel={(query) => query}
          onChange={(val) => val && addItem(val)}
          value={form.values.status}
          error={form.errors.status}
        />
        <Space />
        <Items />
        <Space />
        <Button type='submit'>Створити</Button>
      </form>
      <Space />
      <Button variant='light' color='red' component='a' href='/'>
        Вийти на Головну
      </Button>
    </Container>
  );
};

export default NewOrder;
