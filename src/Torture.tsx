
import { FC, useMemo } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form } from './Form';
import { TortureParams, Patterns, PATTERNS } from './torture_params';


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

interface Props {
  setGcode: (gcode: string | null) => void;
}

export const Torture: FC<Props> = ({ setGcode }) => {
  const initialValues = useMemo(createInitialValues, []);

  return (
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
        <Form
          handleSubmit={handleSubmit}
          handleBlur={handleBlur}
          handleChange={handleChange}
          values={values}
          errors={errors}
          isSubmitting={isSubmitting}
        />
      )}
    </Formik>
  );
}
