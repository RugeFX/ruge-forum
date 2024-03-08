import type { Meta, StoryObj } from '@storybook/react';
import Avatar from '../avatar';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    user: { control: 'object' },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: {
      id: 'test',
      name: 'RugeFX',
      avatar:
        'https://avatars.githubusercontent.com/u/99505538?s=400&u=4e0daf9a3155b60c503efeb9421c98fe868cc1ad&v=4',
    },
  },
};

export const Fallback: Story = {
  args: {
    user: { id: 'test', name: 'RugeFX', avatar: '' },
  },
};
