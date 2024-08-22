import React from 'react'
import { FormControl, FormDescription, FormField, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Control, FieldPath } from 'react-hook-form'
import { z } from 'zod'
import { authFormSchema } from '@/lib/utils'

const formSchema = authFormSchema("sign-up")

interface CustomInput {
    control: Control<z.infer<typeof formSchema>>,
    name: FieldPath<z.infer<typeof formSchema>>,
    label: string,
    placeholder: string,
    description?: string
}

const CustomInput = ({ control, name, label, placeholder, description }: CustomInput) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <div className="form-item">
                    <FormLabel className="form-label">
                        {label}
                    </FormLabel>
                    <FormDescription className="text-12 font-normal text-gray-600">
                    {description}
                  </FormDescription>
                    <div className="flex w-full flex-col">
                        <FormControl>
                            <Input placeholder={placeholder} className="input-class" type={name === "password" ? name : "text"} {...field} />
                        </FormControl>
                        <FormMessage className="form-message mt-2" />
                    </div>
                </div>
            )}
        />
    )
}

export default CustomInput