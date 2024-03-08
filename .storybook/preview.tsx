import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { initialize, mswLoader } from "msw-storybook-addon";
import handlers from "../src/mocks/handlers";
import { makeStore } from "../src/app/store";
import type { Preview } from "@storybook/react";
import "../src/index.css";

initialize({}, handlers);
const store = makeStore({ auth: { userToken: "valid-test-token" } });

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Provider store={store}>
          <Story />
        </Provider>
      </MemoryRouter>
    )
  ],
  loaders: [mswLoader]
};

export default preview;
