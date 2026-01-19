import React from 'react'

const EditorButtons = () => {

    const handleShareButtonClick = () => {
        console.log("Share button clicked, small window should pop up")
    }
    const handleCloneButtonClick = () => {
        console.log("Share button clicked, clone window should pop up")
    }
    const handlePDFButtonClick = () => {
        console.log("PDF button clicked, cool sonner banner should appear")
    }
    const handleDeleteButtonClick = () => {
        console.log("Delete button clicked, reassuring window should pop up")
    }

  return (
    <div>

      <button onClick={() => handleShareButtonClick}>Share</button>
      <button onClick={() => handleCloneButtonClick}>Clone</button>
      <button onClick={() => handlePDFButtonClick}>PDF</button>
      <button onClick={() => handleDeleteButtonClick}>Delete</button>

    </div>
  )
}

export default EditorButtons
