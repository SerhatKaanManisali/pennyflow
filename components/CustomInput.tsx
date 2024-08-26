import React from 'react'
import { FormControl, FormDescription, FormField, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { authFormSchema, cn } from '@/lib/utils'
import Datepicker from './Datepicker'

const formSchema = authFormSchema("sign-up");

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
                            {name === 'dateOfBirth' ? (
                                <Datepicker field={field} />
                            ) : (
                                <Input placeholder={placeholder} className="input-class" type={name === "password" ? name : "text"} {...field} />
                            )}
                        </FormControl>
                        <FormMessage className="form-message mt-2" />
                    </div>
                </div>
            )}
        />
    )
}

export default CustomInput