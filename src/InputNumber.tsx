import { FormikErrors } from "formik";
import { FC } from "react";
import { TortureParams } from "./torture_params";

interface InputNumberProps {
  name: keyof TortureParams,
  label: string,
  handleChange: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  },
  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  },
  values: TortureParams
  errors: FormikErrors<TortureParams>,
}

export const InputNumber: FC<InputNumberProps> = ({ name, label, handleChange, handleBlur, values, errors }) => {
  console.log(errors, errors[name])
  return (
    <>
      <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <input
          type="number"
          name={name}
          id={name}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values[name] as number}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
      {errors[name]
        ? <p className="mt-2 text-sm text-red-600" id="email-error">
          {errors[name]}
        </p>
        : null
      }
    </>
  )
}
