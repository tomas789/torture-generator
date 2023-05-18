
import React, { FC, useMemo, useState } from 'react';
import { Formik, FormikErrors } from 'formik';
import * as Yup from 'yup';

const PATTERNS = ["-", "|", "o", "/", "\\"] as const;
type PatternTuple = typeof PATTERNS;
type Patterns = PatternTuple[number];

const TortureParamsSchema = Yup.object().shape({
  bedSizeX: Yup.number()
    .min(0, 'Bed size must be postive.')
    .max(10000, 'Is your bed larger than 10m?')
    .required('Required'),
  bedSizeY: Yup.number()
    .min(0, 'Bed size must be postive.')
    .max(10000, 'Is your bed larger than 10m?')
    .required('Required'),
  zOffset: Yup.number()
    .min(0, 'Z offset must be postive.')
    .max(10000, 'Is your bed larger than 10m?')
    .required('Required'),
  pattern: Yup.mixed<Patterns>().oneOf(PATTERNS),
  patternSize: Yup.number()
    .min(0, 'Pattern size must be postive.')
    .max(10000, 'Pattern larger than 10m?')
    .required('Required'),
  initialAcceleration: Yup.number()
    .min(1, 'Acceleration must be a positive number.')
    .max(1000000, 'This acceleration will breat the universe!')
    .required('Required'),
  finalAcceleration: Yup.number()
    .min(1, 'Acceleration must be a positive number.')
    .max(1000000, 'This acceleration will breat the universe!')
    .required('Required'),
  initialSpeed: Yup.number()
    .min(1, 'Speed must be a positive number.')
    .max(1000000, 'This speed will breat the universe!')
    .required('Required'),
  finalSpeed: Yup.number()
    .min(1, 'Speed must be a positive number.')
    .max(1000000, 'This speed will breat the universe!')
    .required('Required'),
  steps: Yup.number()
    .min(1, 'Number or steps must be a positive number.')
    .max(100, 'Maximum number of steps is 100.')
    .required('Required'),
  repetitions: Yup.number()
    .min(1, 'Number or repetitions must be a positive number.')
    .max(100, 'Maximum number of repetitions is 100.')
    .required('Required'),
  waitAfterStep: Yup.number()
    .min(0, 'Waiting time must be zero or positive number.')
    .max(1000000, 'Maybe try something smaller?'),
});


interface TortureParams {
  bedSizeX: number,
  bedSizeY: number,
  homeAtStart: boolean,
  zOffset: number,
  pattern: Patterns,
  patternSize: number,
  initialAcceleration: number,
  finalAcceleration: number,
  initialSpeed: number,
  finalSpeed: number,
  steps: number
  repetitions: number,
  waitAfterStep: number | null
}

function createInitialValues(): TortureParams {
  return {
    bedSizeX: 235,
    bedSizeY: 235,
    homeAtStart: true,
    zOffset: 30,
    pattern: "-",
    patternSize: 200,
    initialAcceleration: 1000,
    finalAcceleration: 10000,
    initialSpeed: 100,
    finalSpeed: 100,
    steps: 10,
    repetitions: 1,
    waitAfterStep: 1000
  }
}

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

const InputNumber: FC<InputNumberProps> = ({ name, label, handleChange, handleBlur, values, errors }) => {
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

const RenderForm: FC<Props> = ({ handleSubmit, values, handleBlur, handleChange, errors, isSubmitting }) => {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="m-4">
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
      </div>
    </div>
  )
}

const downloadGcode = (gcode: string) => {
  const element = document.createElement("a");
  const file = new Blob([gcode], { type: 'text/x-gcode' });
  element.href = URL.createObjectURL(file);
  element.download = "torture.gcode";
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
}

const generateGcode = (params: TortureParams): string => {
  var lines: string[] = [];

  if (params.homeAtStart) {
    lines.push("G28    ; Home all axes.");
  }

  lines.push("G21    ; Set units to millimeters.");
  lines.push("");

  const midX = params.bedSizeX / 2;
  const midY = params.bedSizeY / 2;
  const bboxX0 = params.bedSizeX / 2 - params.patternSize / 2;
  const bboxX1 = params.bedSizeX / 2 + params.patternSize / 2;
  const bboxY0 = params.bedSizeY / 2 - params.patternSize / 2;
  const bboxY1 = params.bedSizeY / 2 + params.patternSize / 2;

  if (params.pattern === "-") {
    lines.push("; Move to the left in X and middle in Y.")
    lines.push(`G1 X${bboxX0} Y${midY} Z${params.zOffset}`)
    lines.push("");
  } else if (params.pattern === "o") {
    lines.push("; Move to the middle in X and to the back.")
    lines.push(`G1 X${midX} Y${bboxY1} Z${params.zOffset}`)
    lines.push("");
  } else if (params.pattern === "|") {
    lines.push("; Move to the middle in X and to the front.")
    lines.push(`G1 X${midX} Y${bboxY0} Z${params.zOffset}`)
    lines.push("");
  } else if (params.pattern === "/") {
    lines.push("; Move to the front left corner.")
    lines.push(`G1 X${bboxX0} Y${bboxY0} Z${params.zOffset}`)
    lines.push("");
  } else if (params.pattern === "\\") {
    lines.push("; Move to the front right corner.")
    lines.push(`G1 X${bboxX1} Y${bboxY0} Z${params.zOffset}`)
    lines.push("");
  }

  const circumference = Math.PI * params.patternSize; // [mm]
  const arcResolution = 1.0 // [mm]
  const nArcSteps = circumference / arcResolution;

  for (var step = 0; step < params.steps; ++step) {
    const accel = params.initialAcceleration + step * (params.finalAcceleration - params.initialAcceleration) / params.steps;
    const speed = params.initialSpeed + step * (params.finalSpeed - params.initialSpeed) / params.steps;

    lines.push(`; Step ${step + 1}: Pattern at speed ${speed} mm/s acceleration of ${accel} mm/s/s.`)
    lines.push(`M204 S${accel}  ; Set acceleration of ${accel} mm/s/s`)
    lines.push(`G1 F${speed}  ; Set feed rate to ${speed} mm/s`)
    for (var rep = 0; rep < params.repetitions; ++rep) {
      lines.push(`; Repetition ${rep + 1}`);
      switch (params.pattern) {
        case "-":
          lines.push(`G1 X${bboxX1}`);
          lines.push(`G1 X${bboxX0}`);
          break;
        case "|":
          lines.push(`G1 Y${bboxY1}`);
          lines.push(`G1 Y${bboxY0}`);
          break;
        case "o":
          let t = 0;
          while (true) {
            let x = midX + Math.sin(t) * params.patternSize / 2;
            let y = midY + Math.cos(t) * params.patternSize / 2;
            lines.push(`G1 X${x} Y${y}`)
            if (t >= 1.0) {
              break;
            }
            t = Math.min(1.0, t + 1.0 / nArcSteps);
          }
          break;
        case "/":
          lines.push(`G1 X${bboxX1} Y${bboxY1}`);
          lines.push(`G1 X${bboxX0} Y${bboxY0}`);
          break;
        case "\\":
          lines.push(`G1 X${bboxX0} Y${bboxY1}`);
          lines.push(`G1 X${bboxX1} Y${bboxY0}`);
          break;
      }
    }
    if (params.waitAfterStep !== 0) {
      lines.push(`G4 P${params.waitAfterStep}    ; Wait for 1s.`)
    }
    lines.push("");
  }

  return lines.join("\n");
}

const Basic = () => {
  const initialValues = useMemo(createInitialValues, []);
  const [gcode, setGcode] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 gap-4 p-4 h-full">
      <div>
        <Formik
          initialValues={initialValues}
          validateOnChange={true}
          validationSchema={TortureParamsSchema}
          validateOnMount={true}
          validate={values => {
            const errors: { [name: string]: string } = {};

            if (values.patternSize >= values.bedSizeX) {
              errors.patternSize = `Pattern must be smaller than size of the bed (X = ${values.bedSizeX})`
            }
            if (values.patternSize >= values.bedSizeY) {
              errors.patternSize = `Pattern must be smaller than size of the bed (Y = ${values.bedSizeY})`
            }
            if (values.initialAcceleration > values.finalAcceleration) {
              errors.finalAcceleration = `Must be at larger than or equal to the initial acceleration (${values.initialAcceleration})`
            }
            if (values.initialSpeed > values.finalSpeed) {
              errors.finalSpeed = `Must be at larger than or equal to the initial speed (${values.initialSpeed})`
            }

            if (Object.keys(errors).length === 0) {
              const gcode = generateGcode(values);
              setGcode(gcode);
            } else {
              setGcode(null);
            }
            return errors;
          }}
          onSubmit={() => { }}
        >
          {({ isSubmitting, handleSubmit, handleBlur, handleChange, values, errors }) => (
            <RenderForm
              handleSubmit={handleSubmit}
              handleBlur={handleBlur}
              handleChange={handleChange}
              values={values}
              errors={errors}
              isSubmitting={isSubmitting}
            />
          )}
        </Formik>
      </div>
      <div className='h-full flex flex-col space-y-4'>
        <div className="flex flex-row space-x-2">
          <button
            type="button"
            onClick={() => downloadGcode(gcode !== null ? gcode : "")} disabled={gcode === null}
            className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Download G-Code
          </button>
          <a
            type="button"
            href="https://www.klipper3d.org/G-Codes.html"
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Klipper G-Code
          </a>
          <a
            type="button"
            href="https://marlinfw.org/meta/gcode/"
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Marlin G-Code
          </a>
        </div>
        <textarea className="w-full grow" value={gcode !== null ? gcode : ""} readOnly={true} style={{ fontFamily: "monospace" }} />
      </div>
    </div>
  );
}

export default Basic;
