import type { Meta, StoryObj } from '@storybook/react';

import { Button, type ButtonProps } from './Button';

export default {
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'],
} as Meta<ButtonProps>;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
    args: {
        children: 'Default Button',
    },
};
