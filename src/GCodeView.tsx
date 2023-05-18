import { FC } from "react"

interface Props {
    gcode: string | null
}

const downloadGcode = (gcode: string) => {
  const element = document.createElement("a");
  const file = new Blob([gcode], { type: 'text/x-gcode' });
  element.href = URL.createObjectURL(file);
  element.download = "torture.gcode";
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
}


export const GCodeView: FC<Props> = ({ gcode }) => {
    return (
        <>
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
        <textarea className="w-full grow" value={gcode !== null ? gcode : ""} readOnly={true} style={{ fontFamily: "monospace" }} />
        </>
    )
}