import React from 'react'
import EditorButtons from './EditorButtons'
import EditorField from "./EditorField"
import { ControlledFilterDialog } from './FilterPopup';


type EditorProps = {
    jwt: string | null,
    setJwt?: (c: string | null) => void;
}

const Editor = ({jwt}: EditorProps) => {
  return (
    <>
    {/* Render this if user is logged in */}
    {jwt && <div>
      <EditorButtons />
      <div>
        <EditorField />
        <div>Word count</div>
      </div>

    </div>}

{/* Render this if user is NOT logged in */}
      {!jwt && 
        <>
          <div>You are not logged in, you are in view-only guest mode.</div>
        <div>Popup dialog prompting you to log in</div>
        </>
        }

    </>
  )
}

export default Editor
