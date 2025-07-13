import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiDemo } from './ApiDemo';
import {
  useApiGatewayHealth,
  useApiGatewayStatus,
} from '@/hooks/useApiGatewayHealth';

// Mock the hooks
vi.mock('@/hooks/useApiGatewayHealth', () => ({
  useApiGatewayHealth: vi.fn(),
  useApiGatewayStatus: vi.fn(),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('ApiDemo Component', () => {
  const mockBasicHealth = {
    health: {
      status: 'UP',
      service: 'api-gateway',
      port: '8085',
      timestamp: '2024-01-15T10:30:00Z',
      version: '1.0.0',
    },
    isLoading: false,
    error: null,
    isError: false,
    refetch: vi.fn(),
    isHealthy: true,
    dependencies: undefined,
    configuration: undefined,
  };

  const mockDetailedHealth = {
    ...mockBasicHealth,
    dependencies: {
      'user-service': 'UP',
      'journal-service': 'UP',
      'genai-service': 'UP',
    },
    configuration: {
      authentication: 'enabled',
      microservices: 'configured',
      'port-binding': 'enabled',
    },
  };

  const mockStatus = {
    status: 'OK',
    isLoading: false,
    error: null,
    isError: false,
    refetch: vi.fn(),
    isOnline: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useApiGatewayHealth as any).mockImplementation((detailed: boolean) =>
      detailed ? mockDetailedHealth : mockBasicHealth,
    );
    (useApiGatewayStatus as any).mockReturnValue(mockStatus);
  });

  it('renders the API Gateway Health Monitor when open', () => {
    render(<ApiDemo open={true} />);

    expect(screen.getByText('API Gateway Health Monitor')).toBeInTheDocument();
    expect(screen.getByText('Health Status')).toBeInTheDocument();
    expect(screen.getByText('api-gateway')).toBeInTheDocument();
    expect(screen.getByText('UP')).toBeInTheDocument();
  });

  it('switches between basic and detailed views', async () => {
    const user = userEvent.setup();

    render(<ApiDemo open={true} />);

    // Click on detailed button
    const detailedButton = screen.getByText('Detailed');
    await act(async () => {
      await user.click(detailedButton);
    });

    // Should show detailed information
    expect(screen.getByText('Service Dependencies')).toBeInTheDocument();
    expect(screen.getByText('Configuration Status')).toBeInTheDocument();
  });

  it('handles error state correctly', () => {
    const errorHealth = {
      ...mockBasicHealth,
      isError: true,
      error: { message: 'Connection failed' },
    };

    (useApiGatewayHealth as any).mockImplementation(() => errorHealth);

    render(<ApiDemo open={true} />);

    expect(screen.getByText('Error: Connection failed')).toBeInTheDocument();
  });
});
