import type { Meta, StoryObj } from '@storybook/react';
import { GradientButton } from './GradientButton';

import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';

const meta: Meta<typeof GradientButton> = {
  component: GradientButton,
  title: 'Button/GradientButton',
};
export default meta;
type Story = StoryObj<typeof GradientButton>;

export const Primary: Story = {
  args: {
    children: 'GradientButton',
    className: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/GradientButton/gi)).toBeTruthy();
  },
};
