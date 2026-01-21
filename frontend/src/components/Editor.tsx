import React from 'react'
import EditorButtons from './EditorButtons'
import EditorField from "./Editor"

const Editor = () => {
  return (
    <div>
      <EditorButtons />
      <div>
        <EditorField />
        <div>Word count</div>
      </div>

    </div>
  )
}

export default Editor
