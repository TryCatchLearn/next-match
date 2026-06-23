import { FieldError, Input, Label, TextArea, TextField } from "@heroui/react";
import { ComponentProps } from "react";
import { FieldValues, useController, UseControllerProps } from "react-hook-form";

type Props<T extends FieldValues> = {
    label?: string;
    placeholder?: string;
    type?: ComponentProps<typeof Input>['type'];
    multiline?: boolean;
    rows?: number;
    max?: string;
    min?: string;
} & UseControllerProps<T>

export default function TextInput<T extends FieldValues>(props: Props<T>) {
    const { label, placeholder, multiline, rows = 4, max, min, type = 'text', ...controllerProps } = props;
    const { field, fieldState } = useController(controllerProps);

    return (
        <TextField
            aria-label={label ?? controllerProps.name}
            isInvalid={!!fieldState.error}
            className='pb-3'
        >
            {label && <Label>{label}</Label>}
            {multiline ? (
                <TextArea
                    rows={rows}
                    placeholder={placeholder ?? label}
                    {...field}
                />
            ) : (
                <Input
                    placeholder={placeholder ?? label}
                    type={type}
                    {...field}
                    max={max}
                    min={min}
                />
            )}

            <FieldError>{fieldState.error?.message}</FieldError>
        </TextField>
    )
}