import React, { useEffect, useState } from 'react';

interface SmartNumericInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: string;
    onUpdate: (target: HTMLInputElement) => void;
    className: string;
    clearContentOnFocus?: boolean;
}

export default function SmartNumericInput({
    value,
    onUpdate,
    className,
    clearContentOnFocus,
    ...inputProps
}: SmartNumericInputProps) {
    if (!clearContentOnFocus) clearContentOnFocus = false;

    const [inputContent, setInputContent] = useState<string>(value);

    const [inputContentUpdateFlag, setInputContentUpdateFlag] = useState<boolean>(false);

    if (inputContentUpdateFlag) {
        setInputContent(value);
        setInputContentUpdateFlag(false);
    }

    useEffect(() => {setInputContentUpdateFlag(true);}, [value]);

    const resetInputContent = () => setInputContent(value);

    let ignoreBlur = false;
    const blurWithoutUpdate = (e: React.FocusEvent<HTMLInputElement, Element> | React.KeyboardEvent<HTMLInputElement>) => {
        ignoreBlur = true;
        (e.target as HTMLInputElement).blur();
        ignoreBlur = false;
    };

    const runOnConfirm = (
        e:
         | React.FocusEvent<HTMLInputElement | Element>
         | React.KeyboardEvent<HTMLInputElement>
         | React.ChangeEvent<HTMLInputElement>
    ) => {
        onUpdate(e.target as HTMLInputElement);
        setInputContentUpdateFlag(true);
    };

    return (
        <input
            {...inputProps}
            value ={inputContent}
            onChange={(e) => {
                if (inputProps.onChange) inputProps.onChange(e);
                setInputContent(e.target.value);
            }}
            onBlur={(e) => {
                if (inputProps.onBlur) inputProps.onBlur(e);
                if (!ignoreBlur) {
                    if (clearContentOnFocus && inputContent === '') resetInputContent();
                    else runOnConfirm(e);
                }
            }}
            onKeyDown={(e) => {
                if (inputProps.onKeyDown) inputProps.onKeyDown(e);
                if (e.key === 'Enter') {
                    blurWithoutUpdate(e);
                    runOnConfirm(e);
                } else if (e.key === 'Escape') {
                    blurWithoutUpdate(e);
                    resetInputContent();
                }
            }}
            onFocus={(e) => {
                if (inputProps.onFocus) inputProps.onFocus(e);
                if (clearContentOnFocus) setInputContent('');
            }}
            className={className}
            autoComplete="off"
            spellCheck="false"
            maxLength={3}
        />
    );
}