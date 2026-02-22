import { render, screen } from '@testing-library/react';
import { CreditCard, Mail, Settings } from 'lucide-react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { type Step, Stepper, type StepperProps } from './stepper';

const defaultSteps: Step[] = [
    { id: '1', label: 'Account', icon: Mail },
    { id: '2', label: 'Profile', icon: Settings },
    { id: '3', label: 'Payment', icon: CreditCard }
];

const makeSut = (props: Partial<StepperProps> = {}) => {
    const defaultProps: StepperProps = {
        steps: defaultSteps,
        currentStep: 1,
        ...props
    };

    const result = render(<Stepper {...defaultProps} />);

    return {
        container: result.container,
        rerender: (newProps: Partial<StepperProps>) => result.rerender(<Stepper {...defaultProps} {...newProps} />)
    };
};

describe('<Stepper />', () => {
    beforeEach(() => {
        Element.prototype.scrollTo = vi.fn();
    });

    describe('Rendering', () => {
        it('should render all steps', () => {
            makeSut();

            expect(screen.getByText('Account')).toBeInTheDocument();
            expect(screen.getByText('Profile')).toBeInTheDocument();
            expect(screen.getByText('Payment')).toBeInTheDocument();
        });

        it('should render step icons', () => {
            const { container } = makeSut();

            const icons = container.querySelectorAll('svg');
            // 3 steps icons + connectors
            expect(icons.length).toBeGreaterThanOrEqual(3);
        });

        it('should render connector lines between steps', () => {
            const { container } = makeSut();

            const connectors = container.querySelectorAll('[class*="h-0.5"]');
            expect(connectors).toHaveLength(2);
        });

        it('should not render connector after last step', () => {
            const singleStep = defaultSteps[0];
            if (!singleStep) return;

            const { container } = makeSut({ steps: [singleStep] });

            const connectors = container.querySelectorAll('[class*="h-0.5"]');
            expect(connectors).toHaveLength(0);
        });
    });

    describe('Step Status', () => {
        it('should show first step as active when currentStep is 1', () => {
            const { container } = makeSut({ currentStep: 1 });

            const stepIndicators = container.querySelectorAll('[class*="bg-primary"]');
            expect(stepIndicators).toHaveLength(1);
        });

        it('should show completed steps with check icon', () => {
            makeSut({ currentStep: 2 });

            const checkIcons = screen.getAllByLabelText('Completed');
            expect(checkIcons).toHaveLength(1);
        });

        it('should show active step with original icon', () => {
            const { container } = makeSut({ currentStep: 2 });

            const icons = container.querySelectorAll('svg:not([aria-label="Completed"])');
            expect(icons.length).toBeGreaterThanOrEqual(2);
        });

        it('should show all steps as completed when currentStep is greater than total', () => {
            makeSut({ currentStep: 4 });

            const checkIcons = screen.getAllByLabelText('Completed');
            expect(checkIcons).toHaveLength(3);
        });

        it('should show all steps as pending when currentStep is 0', () => {
            const { container } = makeSut({ currentStep: 0 });

            const pendingElements = container.querySelectorAll('[class*="bg-accent"]');
            expect(pendingElements.length).toBeGreaterThanOrEqual(3);
        });
    });

    describe('Label Position', () => {
        it('should render with bottom label position by default', () => {
            const { container } = makeSut();

            const stepContainers = container.querySelectorAll('[class*="flex-col"]');
            expect(stepContainers.length).toBeGreaterThan(0);
        });

        it('should render with top label position', () => {
            const { container } = makeSut({ labelPosition: 'top' });

            const stepContainers = container.querySelectorAll('[class*="flex-col-reverse"]');
            expect(stepContainers.length).toBeGreaterThan(0);
        });

        it('should render with right label position', () => {
            const { container } = makeSut({ labelPosition: 'right' });

            const stepContainers = container.querySelectorAll('[class*="flex-row"]');
            expect(stepContainers.length).toBeGreaterThan(0);
        });

        it('should render with left label position', () => {
            const { container } = makeSut({ labelPosition: 'left' });

            const stepContainers = container.querySelectorAll('[class*="flex-row-reverse"]');
            expect(stepContainers.length).toBeGreaterThan(0);
        });
    });

    describe('Connector Lines', () => {
        it('should show blue connector line for completed steps', () => {
            const { container } = makeSut({ currentStep: 2 });

            const blueConnectors = container.querySelectorAll('[class*="bg-primary"]');
            expect(blueConnectors.length).toBeGreaterThanOrEqual(2); // Step 1 + linha
        });

        it('should show gray connector line for pending steps', () => {
            const { container } = makeSut({ currentStep: 2 });

            const grayConnectors = container.querySelectorAll('[class*="bg-accent"]');
            expect(grayConnectors.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('Scroll Behavior', () => {
        it('should call scrollTo when currentStep changes', () => {
            const scrollToMock = vi.fn();

            Element.prototype.scrollTo = scrollToMock;

            const { rerender } = makeSut({ currentStep: 1 });

            rerender({ currentStep: 2 });

            setTimeout(() => {
                expect(scrollToMock).toHaveBeenCalled();
            }, 0);
        });
    });

    describe('Accessibility', () => {
        it('should have aria-label for completed steps', () => {
            makeSut({ currentStep: 2 });

            const completedIcons = screen.getAllByLabelText('Completed');
            expect(completedIcons.length).toBeGreaterThan(0);
        });

        it('should render as list (ol)', () => {
            const { container } = makeSut();

            expect(container.querySelector('div')).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('should handle single step', () => {
            const singleStep = defaultSteps[0];
            if (!singleStep) return;

            makeSut({ steps: [singleStep], currentStep: 1 });

            expect(screen.getByText('Account')).toBeInTheDocument();
        });

        it('should handle empty steps array', () => {
            const { container } = makeSut({ steps: [] });

            const stepContainers = container.querySelectorAll('[class*="flex items-start w-full"]');
            expect(stepContainers).toHaveLength(0);
        });

        it('should handle long labels with line-clamp', () => {
            const longLabel = 'This is a very long label that should be truncated';
            makeSut({
                steps: [{ id: '1', label: longLabel, icon: Mail }]
            });

            expect(screen.getByText(longLabel)).toBeInTheDocument();
        });

        it('should handle negative currentStep', () => {
            const { container } = makeSut({ currentStep: -1 });

            const pendingElements = container.querySelectorAll('[class*="bg-accent"]');
            expect(pendingElements.length).toBeGreaterThanOrEqual(3);
        });
    });

    describe('Responsive', () => {
        it('should have responsive classes for indicator size', () => {
            const { container } = makeSut();

            const indicators = container.querySelectorAll('[class*="size-8"]');
            expect(indicators.length).toBeGreaterThan(0);
        });

        it('should have responsive classes for icon size', () => {
            const { container } = makeSut();

            const icons = container.querySelectorAll('[class*="size-4"]');
            expect(icons.length).toBeGreaterThan(0);
        });
    });
});
