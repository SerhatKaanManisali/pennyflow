import React from 'react'
import { FormControl, FormDescription, FormLabel, FormMessage } from './ui/form'
import { Controller } from 'react-hook-form';
import { Input } from './ui/input';
import InputMask from 'react-input-mask';

const CustomInput = ({ control, name, label, placeholder, description }: CustomInput) => {
    const isDateField = name === 'dateOfBirth';
    const isStateField = name === 'state';

    return (
        <div className="form-item">
            <FormLabel className="form-label">
                {label}
            </FormLabel>

            {description && (
                <FormDescription className="text-12 font-normal text-gray-600">
                    {description}
                </FormDescription>
            )}

            <FormControl>
                <Controller
                    control={control}
                    name={name}
                    render={({ field, fieldState: { error } }) => (
                        <>
                            {isDateField ? (
                                <InputMask
                                    mask="99-99-9999"
                                    placeholder={placeholder}
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                >
                                    {(inputProps: any) => (
                                        <Input
                                            {...inputProps}
                                            className={`input-class ${error ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                    )}
                                </InputMask>
                            ) : (
                                <Input
                                    placeholder={placeholder}
                                    type={name === 'password' ? 'password' : name === 'ssn' ? 'number' : 'text'}
                                    {...field}
                                    onChange={(e) => {
                                        const value = isStateField ? e.target.value.toUpperCase() : e.target.value;
                                        field.onChange(value);
                                    }}
                                    className={`input-class ${error ? 'border-red-500' : 'border-gray-300'}`}
                                />
                            )}
                            {error && (
                                <FormMessage className="form-message">
                                    {error.message}
                                </FormMessage>
                            )}
                        </>
                    )}
                />
            </FormControl>
        </div>
    )
}

export default CustomInput
