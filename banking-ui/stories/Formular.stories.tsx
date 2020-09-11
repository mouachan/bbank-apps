import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { Formular } from '@app/Formular/Formular';

const stories = storiesOf('Components', module);
stories.addDecorator(withInfo);
stories.add(
  'Formular',
  () => <Formular />,
  { info: { inline: true } }
);
