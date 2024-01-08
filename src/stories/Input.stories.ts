import type { Meta, StoryObj } from '@storybook/react';

import { Input } from './Input';

const meta = {
  title: 'Example/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },

  tags: ['autodocs'],

  argTypes: {
    // backgroundColor: { control: 'color' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Edit Input',
  },
};

export const Value: Story = {
  args: {
    value: 'Change Input',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    value: 'test'
  },
};