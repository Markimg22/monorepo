import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronRightIcon, MailIcon, TrashIcon } from 'lucide-react';

import { Button, type ButtonProps } from './button';

export default {
    title: 'Components/UI/Button',
    component: Button,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered'
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']
        },
        size: {
            control: 'select',
            options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg']
        },
        disabled: {
            control: 'boolean'
        },
        asChild: {
            control: 'boolean'
        }
    }
} as Meta<ButtonProps>;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
    args: {
        children: 'Button'
    }
};

export const Variants: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2">
                <Button variant="default">Default</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
            </div>
        </div>
    )
};

export const Sizes: Story = {
    render: () => (
        <div className="flex items-center gap-2">
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
        </div>
    )
};

export const WithIcons: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2">
                <Button>
                    <MailIcon />
                    Login with Email
                </Button>
                <Button variant="outline">
                    Continue
                    <ChevronRightIcon />
                </Button>
                <Button variant="destructive">
                    <TrashIcon />
                    Delete
                </Button>
            </div>
        </div>
    )
};

export const IconButtons: Story = {
    render: () => (
        <div className="flex items-center gap-2">
            <Button size="icon-xs" variant="outline">
                <ChevronRightIcon />
            </Button>
            <Button size="icon-sm" variant="outline">
                <ChevronRightIcon />
            </Button>
            <Button size="icon">
                <ChevronRightIcon />
            </Button>
            <Button size="icon-lg" variant="outline">
                <ChevronRightIcon />
            </Button>
        </div>
    )
};

export const Disabled: Story = {
    render: () => (
        <div className="flex gap-2">
            <Button disabled>Default</Button>
            <Button variant="destructive" disabled>
                Destructive
            </Button>
            <Button variant="outline" disabled>
                Outline
            </Button>
            <Button variant="secondary" disabled>
                Secondary
            </Button>
        </div>
    )
};

export const AsChild: Story = {
    render: () => (
        <Button asChild>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                GitHub Link
            </a>
        </Button>
    )
};
