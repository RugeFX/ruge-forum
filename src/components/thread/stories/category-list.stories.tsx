import type { Meta, StoryObj } from '@storybook/react';
import CategoryList from '../category-list';

const meta = {
  title: 'Thread/CategoryList',
  component: CategoryList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    activeCategory: { type: 'string', defaultValue: null },
    categories: { control: 'array' },
  },
} satisfies Meta<typeof CategoryList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    activeCategory: null,
    categories: ['general', 'react', 'github'],
  },
};

export const DifferentActive: Story = {
  args: {
    activeCategory: 'github',
    categories: ['general', 'react', 'github'],
  },
};
