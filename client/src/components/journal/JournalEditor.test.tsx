import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { JournalEditor } from './JournalEditor';

// Mock the API hook
vi.mock('@/api/journal', () => ({
  useGetSummary: vi.fn(() => ({
    isLoading: false,
    refetch: vi.fn(),
  })),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('JournalEditor Component', () => {
  const defaultProps = {
    content: 'Test journal content',
    isEditing: false,
    journalId: 'test-journal-id',
    snippetCount: 5,
    onContentChange: vi.fn(),
    onToggleEdit: vi.fn(),
    onSummarize: vi.fn(),
  };

  it('renders journal content in read mode', () => {
    render(<JournalEditor {...defaultProps} />);

    expect(screen.getByText('Journal Entry')).toBeInTheDocument();
    expect(screen.getByText('Test journal content')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('renders textarea in edit mode', () => {
    render(<JournalEditor {...defaultProps} isEditing={true} />);

    expect(
      screen.getByDisplayValue('Test journal content'),
    ).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('shows summarize button when editing and has enough snippets', () => {
    render(<JournalEditor {...defaultProps} isEditing={true} />);

    expect(screen.getByText('Summarize')).toBeInTheDocument();
  });
});
