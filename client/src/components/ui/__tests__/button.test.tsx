import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import { Button } from '../button';

describe('Button component', () => {
  it('renders children and applies class', () => {
    render(
      <Button variant="secondary" size="lg">
        Click me
      </Button>,
    );
    const btn = screen.getByRole('button', { name: /click me/i });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toMatch(/bg-secondary/);
    expect(btn.className).toMatch(/h-10/);
  });
});
