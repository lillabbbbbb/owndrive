import { useState } from 'react';

import { Button } from "../ui/button"
import { Group, Text } from '@mantine/core';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import '@mantine/core/styles.css';
// ‼️ import dropzone styles after core package styles
import '@mantine/dropzone/styles.css';
import { useFiles } from '../../hooks/useFiles';
import { useAppContext } from "../context/globalContext";
import CustomDialog from '../popups/CustomDialog';

import { useDropzone } from "react-dropzone";

const UploadFileDialog = ()  => {

  const {createFile, filesLoading, filesError} = useAppContext()

  const handleFileUpload = (file : File) => {

    //handle text-based file upload
    createFile()


    //handle image upload



    //POST to DB
    //Route: 
    createFile()
  }

  const { getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: async (files) => {
      try {
        await handleFileUpload(files[0]); // your API call
        console.log("Upload successful!");
      } catch (err) {
        console.error("Upload failed", err);
      }
    },
  });

  return (
    <>
      <input {...getInputProps()} />

      <Button type="button" onClick={open}>
        Upload...
      </Button>

      {filesError && <CustomDialog heading="Error" text="File error"/>}
      {filesLoading && <p>Loading...</p>}
    </>
  );
}

export default UploadFileDialog
