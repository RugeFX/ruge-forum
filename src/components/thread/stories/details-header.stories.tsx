import type { Meta, StoryObj } from '@storybook/react';
import DetailsHeader from '../details-header';

const meta = {
  title: 'Thread/DetailsHeader',
  component: DetailsHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    title: { type: 'string' },
    category: { type: 'string' },
  },
} satisfies Meta<typeof DetailsHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Details Header',
    category: 'thread',
  },
};

export const NoCategory: Story = {
  args: {
    title: 'Details Header (No Category)',
  },
};
