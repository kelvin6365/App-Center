import type { Meta, StoryObj } from '@storybook/react';
import { OutlinedButton } from './OutlinedButton';

import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';

const meta: Meta<typeof OutlinedButton> = {
  component: OutlinedButton,
  title: 'Button/OutlinedButton',
};
export default meta;
type Story = StoryObj<typeof OutlinedButton>;

export const Primary: Story = {
  args: {
    children: 'OutlinedButton',
    className: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/OutlinedButton/gi)).toBeTruthy();
  },
};
