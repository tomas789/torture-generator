import { FormikErrors } from "formik";
import { FC } from "react";
import { InputNumber } from "./InputNumber";
import { PATTERNS, TortureParams } from "./torture_params";

interface Props {
  handleSubmit: () => void,
  values: TortureParams,
  errors: FormikErrors<TortureParams>,
  handleChange: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  },
  handleBlur: {
    (e: React.FocusEvent<any, Element>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  },
  isSubmitting: boolean
}


export const Form: FC<Props> = ({ handleSubmit, values, handleBlur, handleChange, errors, isSubmitting }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="border-b border-gray-900/10 pb-4">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Printer info</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Configure parameters of your printer.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <InputNumber
                name="bedSizeX"
                label="Bed size - X"
                handleBlur={handleBlur}
                handleChange={handleChange}
                values={values}
                errors={errors}
              />
            </div>

            <div className="sm:col-span-3">
              <InputNumber
                name="bedSizeY"
                label="Bed size - Y"
                handleBlur={handleBlur}
                handleChange={handleChange}
                values={values}
                errors={errors}
              />
            </div>

          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-4">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Pattern</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Configure the torture pattern.
          </p>

          <div className="mt-10 space-y-10">
            <fieldset>
              <div className="mt-6 space-y-6">
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="homeAtStart"
                      name="homeAtStart"
                      type="checkbox"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      checked={values.homeAtStart}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="homeAtStart" className="font-medium text-gray-900">
                      Home at start
                    </label>
                    <p className="text-gray-500">When selected, the printer will home before beginning of the test.</p>
                  </div>
                </div>
              </div>
            </fieldset>

            <div className="sm:col-span-3">
              <InputNumber
                name="zOffset"
                label="Z position of the pattern - Choose something such that there is no colision with bed."
                handleBlur={handleBlur}
                handleChange={handleChange}
                values={values}
                errors={errors}
              />
            </div>

            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900">Pattern</legend>
              <p className="mt-1 text-sm leading-6 text-gray-600">Choose a shape of the pattern.</p>
              <div className="mt-6 space-y-6">
                {PATTERNS.map(p =>
                  <div key={p} className="flex items-center gap-x-3">
                    <input
                      name="pattern"
                      type="radio"
                      value={p}
                      checked={values.pattern === p}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label htmlFor="pattern" className="block text-sm font-medium leading-6 text-gray-900">
                      {p}
                    </label>
                  </div>
                )}
              </div>
            </fieldset>
          </div>

          <div className="sm:col-span-3">
            <InputNumber
              name="patternSize"
              label="Size of the pattern"
              handleBlur={handleBlur}
              handleChange={handleChange}
              values={values}
              errors={errors}
            />
          </div>

          <div className="sm:col-span-3">
            <InputNumber
              name="repetitions"
              label="Number of repetitions at each step"
              handleBlur={handleBlur}
              handleChange={handleChange}
              values={values}
              errors={errors}
            />
          </div>

          <div className="sm:col-span-3">
            <InputNumber
              name="steps"
              label="Number of steps"
              handleBlur={handleBlur}
              handleChange={handleChange}
              values={values}
              errors={errors}
            />
          </div>

          <div className="sm:col-span-3">
            <InputNumber
              name="waitAfterStep"
              label="Wait time after each step [ms]"
              handleBlur={handleBlur}
              handleChange={handleChange}
              values={values}
              errors={errors}
            />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <InputNumber
                name="initialSpeed"
                label="Initial speed"
                handleBlur={handleBlur}
                handleChange={handleChange}
                values={values}
                errors={errors}
              />
            </div>

            <div className="sm:col-span-3">
              <InputNumber
                name="finalSpeed"
                label="Final speed"
                handleBlur={handleBlur}
                handleChange={handleChange}
                values={values}
                errors={errors}
              />
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <InputNumber
                name="initialAcceleration"
                label="Initial acceleration"
                handleBlur={handleBlur}
                handleChange={handleChange}
                values={values}
                errors={errors}
              />
            </div>

            <div className="sm:col-span-3">
              <InputNumber
                name="finalAcceleration"
                label="Final acceleration"
                handleBlur={handleBlur}
                handleChange={handleChange}
                values={values}
                errors={errors}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
