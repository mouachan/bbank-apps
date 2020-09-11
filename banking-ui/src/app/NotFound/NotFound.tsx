import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { Alert, PageSection } from '@patternfly/react-core';

const NotFound: React.FunctionComponent = () => (
    <PageSection>
      <Alert variant="danger" title="404! This view hasn't been created yet." /><br />
      <NavLink to="/" >Back to Home</NavLink>
    </PageSection>
  )

export { NotFound };
