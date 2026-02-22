import type { Meta, StoryObj } from '@storybook/react-vite';
import { CreditCard, Files, House, User } from 'lucide-react';

import { Stepper, type StepperProps } from './stepper';

export default {
    title: 'Components/Stepper',
    component: Stepper,
    tags: ['autodocs'],
    argTypes: {
        steps: { control: false },
        labelPosition: { control: 'radio', options: ['top', 'bottom', 'left', 'right'] }
    },
    args: {
        currentStep: 1,
        steps: [
            { id: '1', label: 'Account', icon: User },
            { id: '2', label: 'Files', icon: Files },
            { id: '3', label: 'Payment', icon: CreditCard },
            { id: '4', label: 'Address', icon: House }
        ],
        labelPosition: 'bottom'
    }
} as Meta<StepperProps>;

type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
    render: (args) => <Stepper {...args} />
};
