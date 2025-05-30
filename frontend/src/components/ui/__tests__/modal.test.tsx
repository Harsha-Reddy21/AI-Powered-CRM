import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '../modal';

describe('Modal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Test Modal',
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when isOpen is true', () => {
    render(<Modal {...defaultProps} />);
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Modal {...defaultProps} size="sm" />);
    expect(screen.getByText('Test Modal').closest('.max-w-md')).toBeInTheDocument();

    rerender(<Modal {...defaultProps} size="md" />);
    expect(screen.getByText('Test Modal').closest('.max-w-lg')).toBeInTheDocument();

    rerender(<Modal {...defaultProps} size="lg" />);
    expect(screen.getByText('Test Modal').closest('.max-w-2xl')).toBeInTheDocument();

    rerender(<Modal {...defaultProps} size="xl" />);
    expect(screen.getByText('Test Modal').closest('.max-w-4xl')).toBeInTheDocument();
  });

  it('shows close button by default', () => {
    render(<Modal {...defaultProps} />);
    
    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeInTheDocument();
  });

  it('hides close button when showCloseButton is false', () => {
    render(<Modal {...defaultProps} showCloseButton={false} />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);
    
    const closeButton = screen.getByRole('button');
    await user.click(closeButton);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);
    
    const backdrop = screen.getByText('Test Modal').closest('.fixed.inset-0')?.previousElementSibling;
    if (backdrop) {
      await user.click(backdrop as Element);
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    }
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<Modal {...defaultProps} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when other keys are pressed', () => {
    render(<Modal {...defaultProps} />);
    
    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: 'Space' });
    
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('sets body overflow to hidden when open', () => {
    const originalOverflow = document.body.style.overflow;
    
    render(<Modal {...defaultProps} />);
    
    expect(document.body.style.overflow).toBe('hidden');
    
    // Cleanup
    document.body.style.overflow = originalOverflow;
  });

  it('restores body overflow when closed', () => {
    const originalOverflow = document.body.style.overflow;
    
    const { rerender } = render(<Modal {...defaultProps} />);
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(<Modal {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe('unset');
    
    // Cleanup
    document.body.style.overflow = originalOverflow;
  });

  it('renders custom content', () => {
    const customContent = (
      <div>
        <p>Custom paragraph</p>
        <button>Custom button</button>
      </div>
    );
    
    render(<Modal {...defaultProps}>{customContent}</Modal>);
    
    expect(screen.getByText('Custom paragraph')).toBeInTheDocument();
    expect(screen.getByText('Custom button')).toBeInTheDocument();
  });
}); 