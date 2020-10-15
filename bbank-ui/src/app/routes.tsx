import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Alert, PageSection } from '@patternfly/react-core';
import { LoanValidationImport} from '@app/LoanValidationImport';
import { accessibleRouteChangeHandler } from '@app/utils/utils';
import { LoanValidation } from '@app/LoanValidation/LoanValidation';
import { Monitoring } from '@app/Monitoring/Monitoring';
import { Dashboard } from '@app/Dashboard/Dashboard';


import { AppLayout } from '@app/AppLayout/AppLayout';


import { NotFound } from '@app/NotFound/NotFound';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import { LastLocationProvider, useLastLocation } from 'react-router-last-location';
import { MgmtConsole } from './MgmtConsole/MgmtConsole';



let routeFocusTimer: number;

const getSupportModuleAsync = () => () => import(/* webpackChunkName: 'support' */ '@app/Monitoring/Monitoring');

const Support = (routeProps: RouteComponentProps): React.ReactElement => {
  const lastNavigation = useLastLocation();
  return (
    /* eslint-disable @typescript-eslint/no-explicit-any */
    <LoanValidationImport load={getSupportModuleAsync()} focusContentAfterMount={lastNavigation !== null}>
      {(Component: any) => {
        let loadedComponent: any;
        /* eslint-enable @typescript-eslint/no-explicit-any */
        if (Component === null) {
          loadedComponent = (
            <PageSection aria-label="Loading Content Container">
              <div className="pf-l-bullseye">
                <Alert title="Loading" className="pf-l-bullseye__item" />
              </div>
            </PageSection>
          );
        } else {
          loadedComponent = <Component.Monitoring {...routeProps} />;
        }
        return loadedComponent;
      }}
    </LoanValidationImport>
  );
};

const getPath = () => {
  if(localStorage.getItem("idProcess") != null)
    return "http://management-console-bbank-apps.apps.ocp4.ouachani.org/ProcessInstances/Process/"+localStorage.getItem("idProcess")
  else return "http://management-console-bbank-apps.apps.ocp4.ouachani.org/ProcessInstances/"
};

export interface IAppRoute {
  label?: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  exact?: boolean;
  path: string;
  title: string;
  isAsync?: boolean;
}

const routes: IAppRoute[] = [ 
  {
    component: LoanValidation,
    exact: true,
    label: 'Loan Simulation',
    path: '/loan',
    title: 'Loan | Simulation'
  },
  {
    component: Monitoring,
    exact: true,
    label: 'Loan Simulation Result',
    path: '/result',
    title: 'Loan Result'
  },
  {
    component: Dashboard,
    exact: true,
    label: 'Dashboard',
    path: '/dashboard',
    title: 'Loan Dashboard'
  },
  {
    component: MgmtConsole,
    exact: true,
    label: 'Management Console',
    path: '/mgmtConsole',
    title: 'Management Console'
  },
];

// a custom hook for sending focus to the primary content container
// after a view has loaded so that subsequent press of tab key
// sends focus directly to relevant content
const useA11yRouteChange = (isAsync: boolean) => {
  const lastNavigation = useLastLocation();
  React.useEffect(() => {
    if (!isAsync && lastNavigation !== null) {
      routeFocusTimer = accessibleRouteChangeHandler();
    }
    return () => {
      window.clearTimeout(routeFocusTimer);
    };
  }, [isAsync, lastNavigation]);
};

const RouteWithTitleUpdates = ({ component: Component, isAsync = false, title, ...rest }: IAppRoute) => {
  useA11yRouteChange(isAsync);
  useDocumentTitle(title);

  function routeWithTitle(routeProps: RouteComponentProps) {
    return <Component {...rest} {...routeProps} />;
  }

  return <Route render={routeWithTitle} />;
};

const PageNotFound = ({ title }: { title: string }) => {
  useDocumentTitle(title);
  return <Route component={NotFound} />;
};



const AppRoutes = (): React.ReactElement => (
  
  <LastLocationProvider>
    <Switch>
    {routes.map(({ path, exact, component, title, isAsync }, idx) => (
        <RouteWithTitleUpdates
          path={path}
          exact={exact}
          component={component}
          key={idx}
          title={title}
          isAsync={isAsync}
        />
      ))}
      
    </Switch>

  </LastLocationProvider>
);

export { AppRoutes, routes };
