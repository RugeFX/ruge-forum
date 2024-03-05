/* eslint-disable no-constructor-return */
import {
  describe, it, expect, afterEach,
} from 'vitest';
import { cleanup, screen, within } from '@testing-library/react';
import { renderWithProviders } from 'utils/test-utils';
import CategoryList from '../category-list';

describe('CategoryList Component', () => {
  afterEach(() => cleanup());

  it('should correctly render the category list and style the element holding the current activeCategory differently', () => {
    const categories = ['general', 'redux', 'react'];
    const activeCategory = 'general';

    renderWithProviders(<CategoryList categories={categories} activeCategory={activeCategory} />);
    const list = screen.getByRole('list');
    const { getAllByRole, getByText } = within(list);
    const items = getAllByRole('link');

    expect(items[0]).toBeInTheDocument();
    expect(items[0]).toHaveTextContent('All');
    expect(items).toHaveLength(4);

    const generalItem = getByText('#general');
    expect(generalItem).toBeInTheDocument();
    expect(generalItem).toHaveClass('text-emerald-200 bg-emerald-950');
  });

  it('should still render correctly even if given categories array is empty', () => {
    renderWithProviders(<CategoryList categories={[]} />);
    const list = screen.getByRole('list');
    const { getAllByRole } = within(list);
    const items = getAllByRole('link');

    expect(items[0]).toBeInTheDocument();
    expect(items[0]).toHaveTextContent('All');
    expect(items).toHaveLength(1);
  });

  it('should correctly render the category list and defaults the activeCategory to All when given activeCategory is null or undefined', () => {
    const categories = ['general', 'redux', 'react'];

    renderWithProviders(<CategoryList categories={categories} />);
    const list = screen.getByRole('list');
    const { getAllByRole } = within(list);
    const items = getAllByRole('link');

    expect(items[0]).toBeInTheDocument();
    expect(items[0]).toHaveTextContent('All');
    expect(items[0]).toHaveClass('text-emerald-200 bg-emerald-950');
    expect(items).toHaveLength(4);
  });
});
