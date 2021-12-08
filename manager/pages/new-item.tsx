import {
  Button,
  Container,
  Space,
  Title,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import axios from 'axios';
import { useRouter } from 'next/router';

export const NewItem = (): React.ReactElement => {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      price: '',
      description: '',
      name: '',
    },
    validationRules: {
      name: (value) => !!value,
      price: (value) => !isNaN(+value) && +value > 0,
    },
  });

  return (
    <Container>
      <Space />
      <Title order={3}>Новий Товар</Title>
      <Space />
      <form
        onSubmit={form.onSubmit(async (values) => {
          await axios.post('/api/item/create', {
            values,
          });

          await router.push('/');
        })}
      >
        <TextInput
          required
          placeholder='Назва виробу'
          {...form.getInputProps('name')}
        />
        <Space />
        <Textarea placeholder='Опис' {...form.getInputProps('description')} />
        <Space />
        <TextInput
          required
          type='number'
          placeholder='Ціна'
          {...form.getInputProps('price')}
        />
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

export default NewItem;
