import React from 'react'
import CustomInput from './CustomInput'

const SignUpForm = ({form}: any) => {
    return (
        <>
            <div className="flex gap-4" >
                <CustomInput control={form.control} name={"firstName"} label={"First name"} placeholder={"Enter your first name"} />
                <CustomInput control={form.control} name={"lastName"} label={"Last name"} placeholder={"Enter your last name"} />
            </div>

            < CustomInput control={form.control} name={"address1"} label={"Address"} placeholder={"Enter your address"} />
            <CustomInput control={form.control} name={"city"} label={"City"} placeholder={"Enter your city"} />

            <div className="flex gap-4" >
                <CustomInput control={form.control} name={"state"} label={"State"} placeholder={"Example: NY"} />
                <CustomInput control={form.control} name={"postalCode"} label={"Postal code"} placeholder={"Example: 10317"} />
            </div>

            < div className="flex gap-4" >
                <CustomInput control={form.control} name={"dateOfBirth"} label={"Date of birth"} placeholder={"DD-MM-YYYY"} />
                <CustomInput control={form.control} name={"ssn"} label={"SSN"} placeholder={"Example: 1234"} />
            </div>
        </>
    )
}

export default SignUpForm