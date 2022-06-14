import { Global } from "@emotion/react"
import * as checkbox from "@zag-js/checkbox"
import { useMachine, useSetup, mergeProps } from "@zag-js/react"
import serialize from "form-serialize"
import { useId } from "react"
import { checkboxControls } from "../../../shared/controls"
import { checkboxStyle } from "../../../shared/style"
import { StateVisualizer } from "../components/state-visualizer"
import { Toolbar } from "../components/toolbar"
import { useControls } from "../hooks/use-controls"

export default function Page() {
  const controls = useControls(checkboxControls)

  const [state, send] = useMachine(checkbox.machine, {
    context: controls.context,
  })

  const ref = useSetup<HTMLLabelElement>({ send, id: useId() })

  const api = checkbox.connect(state, send)

  const inputProps = mergeProps(api.inputProps, {
    onChange() {
      if (api.isIndeterminate) {
        api.setIndeterminate(false)
        api.setChecked(true)
      }
    },
  })

  return (
    <>
      <Global styles={checkboxStyle} />

      <main>
        <form
          onChange={(e) => {
            console.log(serialize(e.currentTarget, { hash: true }))
          }}
        >
          <fieldset>
            <label ref={ref} {...api.rootProps}>
              <span {...api.labelProps}>Input {api.isChecked ? "Checked" : "Unchecked"}</span>
              <input {...inputProps} />
              <div {...api.controlProps} />
            </label>

            <button type="button" disabled={api.isChecked} onClick={() => api.setChecked(true)}>
              Check
            </button>
            <button type="button" disabled={!api.isChecked} onClick={() => api.setChecked(false)}>
              UnCheck
            </button>
            <button
              type="button"
              onClick={() => {
                api.setIndeterminate(!api.isIndeterminate)
              }}
            >
              Toggle Indeterminate
            </button>
            <button type="reset">Reset Form</button>
          </fieldset>
        </form>
      </main>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
