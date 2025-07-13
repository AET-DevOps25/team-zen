import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CreateSnippet from './snippet';

// Mock the external dependencies
vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(() => vi.fn()),
}));

vi.mock('@clerk/clerk-react', () => ({
  useUser: vi.fn(() => ({ user: { id: 'test-user' } })),
}));

vi.mock('@/api/snippet', () => ({
  useCreateSnippet: vi.fn(() => ({ mutateAsync: vi.fn() })),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, onClick, ...props }: any) => (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    ),
  },
}));

describe('CreateSnippet Editing', () => {
  it('shows mood selection options', () => {
    render(<CreateSnippet />);

    expect(
      screen.getByText('How are you feeling right now?'),
    ).toBeInTheDocument();
  });

  it('allows text input in textarea', () => {
    render(<CreateSnippet />);

    const textarea = screen.getByPlaceholderText(
      "Share your thoughts, feelings, or what's happening right now...",
    );
    fireEvent.change(textarea, { target: { value: 'Test content' } });

    expect(textarea).toHaveValue('Test content');
  });
});
