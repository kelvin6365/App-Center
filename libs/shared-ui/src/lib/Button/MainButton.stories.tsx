import type { Meta, StoryObj } from '@storybook/react';
import { MainButton } from './MainButton';

import { expect } from '@storybook/jest';
import { within } from '@storybook/testing-library';

const meta: Meta<typeof MainButton> = {
  component: MainButton,
  title: 'Button/MainButton',
};
export default meta;
type Story = StoryObj<typeof MainButton>;

export const Primary: Story = {
  args: {
    children: 'MainButton',
    className: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/MainButton/gi)).toBeTruthy();
  },
};
