import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { Support } from '@app/Monitoring/Monitoring';

const stories = storiesOf('Components', module);
stories.addDecorator(withInfo);
stories.add(
  'Monitoring',
  () => <Monitoring />,
  { info: { inline: true } }
);
