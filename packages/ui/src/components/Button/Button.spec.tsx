import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from './Button';

describe('<Button />', () => {
    it('should render button with childre', () => {
        render(<Button>any children</Button>);
        const button = screen.getByRole('button');

        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('any children');
    });
});
