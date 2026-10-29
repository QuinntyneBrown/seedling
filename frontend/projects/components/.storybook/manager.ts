import { addons } from 'storybook/manager-api';

import seedlingTheme from './theme';

addons.setConfig({
  theme: seedlingTheme,
  // Docs-first like the Fluent docsite: the addon panel opens on demand.
  showPanel: false,
  sidebar: {
    showRoots: true,
  },
});
