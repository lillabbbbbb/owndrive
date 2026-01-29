import React, { useState } from 'react'
import { Button } from "./ui/button"
import { IFileFrontend } from '../types/File'
import { useAppContext } from './context/globalContext'

const ArchivedMenubar = () => {

    const {updateFile, deleteFile, currentFileId} = useAppContext()

    const handleDelete = () => {
        if(!currentFileId) return
        
        deleteFile(currentFileId)
    }

    const handleRestore = () => {
        if(!currentFileId) return
        
        updateFile(currentFileId, {status: "active"})
    }

    const handleRestoreAll = () => {
        
    }

    const handleDeleteAll = () => {
        
    }


  return (
    <div>

        <Button 
      onClick={() => handleRestore()}
      disabled={!currentFileId}
      >Restore all</Button>

        <Button 
      onClick={() => handleRestore()}
      disabled={!currentFileId}
      >Restore</Button>

      <Button 
      onClick={() => handleDelete()}
      disabled={!currentFileId}
      >Delete</Button>

      <Button 
      onClick={() => handleRestore()}
      disabled={!currentFileId}
      >Delete all</Button>

    </div>
  )
}

export default ArchivedMenubar
