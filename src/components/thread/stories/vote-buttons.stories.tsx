import type { Meta, StoryObj } from '@storybook/react';
import { HttpResponse, http } from 'msw';
import threads from 'mocks/data/threads.json';
import { BASE_URL } from 'app/api';
import VoteButtons from '../vote-buttons';

const meta = {
  title: 'Thread/VoteButtons',
  component: VoteButtons,
  parameters: {
    layout: 'centered',
    msw: {
      handlers: [
        http.get(`${BASE_URL}threads`, () => HttpResponse.json({
          status: 'success',
          message: 'data retrieved',
          data: {
            threads: [
              ...threads,
              { ...threads[0], id: 'upvoted-thread', upVotesBy: ['user-test-one'] },
              { ...threads[0], id: 'downvoted-thread', downVotesBy: ['user-test-one'] },
            ],
          },
        })),
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      type: 'string',
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof VoteButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'thread-test-one',
  },
};

export const Upvoted: Story = {
  args: {
    id: 'upvoted-thread',
  },
};

export const Downvoted: Story = {
  args: {
    id: 'downvoted-thread',
  },
};
