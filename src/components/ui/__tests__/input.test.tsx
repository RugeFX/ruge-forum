import {
  describe, it, expect, afterEach,
} from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Input from '../input';

describe('Input Component', () => {
  afterEach(() => cleanup());

  it('should correctly render input', () => {
    render(<Input placeholder="Test" />);
    const input = screen.getByRole('textbox');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Test');
  });

  it('should handle user input correctly', async () => {
    const testInput = 'test input';

    render(<Input placeholder="Test" />);
    const input = screen.getByRole('textbox');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Test');

    await userEvent.type(input, testInput);

    expect(input).toHaveValue(testInput);
  });
});
