'use client'

import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from './ui/calendar'
import { format } from 'date-fns'
import { FormControl } from './ui/form'
import { cn } from '@/lib/utils'
import { ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form'
import { z } from 'zod'

type DatepickerProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = {
    field: ControllerRenderProps<TFieldValues, TName>
}

const Datepicker = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
    field
}: DatepickerProps<TFieldValues, TName>) => {
    const [open, setOpen] = useState(false);
    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            const formattedDate = format(date, 'yyyy-MM-dd');
            field.onChange(formattedDate);
        }
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground", "border-gray-300")}>
                        {field.value ? (
                            format(field.value, "PPP")
                        ) : (
                            <span className='text-16 text-gray-500'>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="start">
                <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={handleDateSelect}
                    disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

export default Datepicker