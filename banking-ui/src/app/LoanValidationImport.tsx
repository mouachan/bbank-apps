import * as React from 'react';
import { accessibleRouteChangeHandler } from '@app/utils/utils';

interface ILoanValidationImport {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  load: () => Promise<any>;
  children: any;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  focusContentAfterMount: boolean;
}

class LoanValidationImport extends React.Component<ILoanValidationImport> {
  public state = {
    component: null,
  };
  private routeFocusTimer: number;
  constructor(props: ILoanValidationImport) {
    super(props);
    this.routeFocusTimer = 0;
  }
  public componentWillUnmount(): void {
    window.clearTimeout(this.routeFocusTimer);
  }
  public componentDidMount(): void {
    this.props
      .load()
      .then((component) => {
        if (component) {
          this.setState({
            component: component.default ? component.default : component,
          });
        }
      })
      .then(() => {
        if (this.props.focusContentAfterMount) {
          this.routeFocusTimer = accessibleRouteChangeHandler();
        }
      });
  }
  public render(): React.ReactNode {
    return this.props.children(this.state.component);
  }
}

export { LoanValidationImport };
