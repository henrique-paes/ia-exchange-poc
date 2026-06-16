import { render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('marks aria-invalid when invalid', () => {
    render(<Input invalid aria-label="name" />);
    expect(screen.getByLabelText('name')).toHaveAttribute('aria-invalid', 'true');
  });

  it('omits aria-invalid when valid', () => {
    render(<Input aria-label="name" />);
    expect(screen.getByLabelText('name')).not.toHaveAttribute('aria-invalid');
  });
});
