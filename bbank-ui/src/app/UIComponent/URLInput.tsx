import React from "react";
import { TextInput } from '@patternfly/react-core';

export interface URLInputProps extends Omit<React.HTMLProps<HTMLInputElement>, 'onChange' | 'ref'> {

    /** A reference object to attach to the input box. */
    innerRef?: React.RefObject<any>;

    /** A callback for when the input value changes. */
    onChange?: (value: string, event: React.FormEvent<HTMLInputElement>) => void;

    /** Value of the input. */
    value?: string | number;

}


export class  URLInputBase extends React.Component<URLInputProps>  {
    static displayName = 'URLInputBase';
    static defaultProps: URLInputProps = {
    onChange: (): any => undefined
    };
    inputRef = React.createRef<HTMLInputElement>();

    render() {
        const {
            value,
            /* eslint-disable @typescript-eslint/no-unused-vars */
            onChange,
            ...props
        } = this.props;
        return (
            <TextInput value={value} type="url" onChange={onChange} aria-label="text input example" />
        );
    }
}

export const URLInput = React.forwardRef((props: URLInputProps, ref: React.Ref<HTMLInputElement>) => (
    <URLInputBase {...props} innerRef={ref as React.MutableRefObject<any>} />
));