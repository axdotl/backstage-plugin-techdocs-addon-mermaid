/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TechDocsAddonTester } from '@backstage/plugin-techdocs-addons-test-utils';

import React from 'react';

import { Mermaid } from '../plugin';
import { selectConfig } from './Mermaid';

describe('Mermaid', () => {
  it('renders without exploding', async () => {
    const { getByText } = await TechDocsAddonTester.buildAddonsInTechDocs([
      <Mermaid config={{ themeVariables: { lineColor: '#00ff00' } }} />,
    ])
      .withDom(<body>TEST_CONTENT</body>)
      .renderWithEffects();

    expect(getByText('TEST_CONTENT')).toBeInTheDocument();
  });

  describe('selectConfig', () => {
    const legacyConfig = { config: { fontFamily: 'legacy-config' } };
    const lightConfig = { lightConfig: { fontFamily: 'light-config' } };
    const darkConfig = { darkConfig: { fontFamily: 'dark-config' } };

    it('legacy config is preferred for backwards-compatibility', () => {
      let config = selectConfig('light', { ...legacyConfig });
      expect(config).toEqual(legacyConfig.config);

      config = selectConfig('light', { ...legacyConfig, ...lightConfig });
      expect(config).toEqual(legacyConfig.config);
    });

    it('light config is selected for light palette', () => {
      const config = selectConfig('light', { ...lightConfig, ...darkConfig });
      expect(config).toEqual(lightConfig.lightConfig);
    });

    it('dark config is selected for dark palette', () => {
      const config = selectConfig('dark', { ...lightConfig, ...darkConfig });
      expect(config).toEqual(darkConfig.darkConfig);
    });
  });
});
