/* eslint-disable no-constructor-return */
import {
  describe, it, expect, afterEach,
} from 'vitest';
import { cleanup, screen, within } from '@testing-library/react';
import threads from 'mocks/data/threads.json';
import { renderWithProviders } from 'utils/test-utils';
import ThreadsList from '../threads-list';

describe('ThreadsList Component', () => {
  afterEach(() => cleanup());

  it('should correctly render the threads list', () => {
    renderWithProviders(<ThreadsList threads={threads} />);
    const list = screen.getByRole('list');
    const { getAllByRole } = within(list);
    const items = getAllByRole('article');

    expect(items).toHaveLength(2);
  });

  it('should render error message if given threads array is empty', () => {
    renderWithProviders(<ThreadsList threads={[]} />);
    const message = screen.getByRole('heading');

    expect(message).toBeInTheDocument();
    expect(message).toHaveTextContent(/no threads available/);
  });
});
