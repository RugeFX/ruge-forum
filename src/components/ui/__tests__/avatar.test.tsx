/* eslint-disable no-constructor-return */
import {
  describe, it, expect, beforeAll, afterAll,
} from 'vitest';
import { render, screen } from '@testing-library/react';
import Avatar from '../avatar';

describe('Avatar Component', () => {
  const orignalGlobalImage = window.Image;

  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.Image as any) = class {
      onload: () => void = () => {
        (() => this)();
      };

      src: string = '';

      constructor() {
        setTimeout(() => {
          this.onload();
        }, 200);
      }
    };
  });

  afterAll(() => {
    window.Image = orignalGlobalImage;
  });

  it('should render the image after it has loaded', async () => {
    const user = {
      id: 'user-test-one',
      name: 'Test User',
      avatar: 'test.png',
    };

    render(<Avatar user={user} />);
    const image = await screen.findByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', "Test User's Profile Picture");
  });

  it('should render the fallback if the image source is invalid or fails to load', async () => {
    const user = {
      id: 'user-test-one',
      name: 'Test User',
      avatar: '',
    };

    render(<Avatar user={user} />);
    const fallback = await screen.findByTestId('fallback');
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveTextContent('TU');
  });
});
