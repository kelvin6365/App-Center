import type { Meta, StoryObj } from '@storybook/react';
import { AppCard } from './AppCard';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof AppCard> = {
  component: AppCard,
  title: 'Card/AppCard',
  decorators: [
    (Story) => (
      <div className="w-[420px] grid grid-cols-2">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof AppCard>;

export const Primary: Story = {
  args: {
    name: '<NAME>',
    description: 'Description of the card',
    icon: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Description of the card/gi)).toBeTruthy();
  },
};
