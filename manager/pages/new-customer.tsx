import { Button, Container, Space, Title, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import axios from 'axios';
import { useRouter } from 'next/router';

export const NewCustomer = (): React.ReactElement => {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      name: '',
      phone: '',
    },
    validationRules: {
      name: (value) => !!value,
      phone: (value) => !!value,
    },
  });

  return (
    <Container>
      <Space />
      <Title order={3}>Новий клієнт</Title>
      <Space />
      <form
        onSubmit={form.onSubmit(async (values) => {
          await axios.post('/api/customer/create', {
            values,
          });

          await router.push('/');
        })}
      >
        <TextInput
          required
          placeholder="Ім'я клієнта"
          {...form.getInputProps('name')}
        />
        <Space />
        <TextInput
          required
          type='tel'
          placeholder='Номер Телефону'
          {...form.getInputProps('phone')}
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

export default NewCustomer;
