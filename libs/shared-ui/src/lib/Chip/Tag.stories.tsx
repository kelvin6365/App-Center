import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof Tag> = {
  component: Tag,
  title: 'Chip/Tag',
  decorators: [
    (Story) => (
      <div className="w-[120px] flex">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Tag>;

export const Primary: Story = {
  args: {
    color: 'cyan',
    value: 'Label',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Label/gi)).toBeTruthy();
  },
};
