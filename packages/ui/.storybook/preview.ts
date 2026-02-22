import { withThemeByClassName } from '@storybook/addon-themes';
import type { Decorator, Preview } from '@storybook/react-vite';

import '../src/styles/globals.css';

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        }
    }
};

export const decorators: Decorator[] = [
    withThemeByClassName({
        themes: {
            light: 'light',
            dark: 'dark'
        },
        defaultTheme: 'light'
    })
];

export default preview;
