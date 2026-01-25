import { useState } from 'react';

import { Button } from "../ui/button"
import { Group, Text } from '@mantine/core';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import '@mantine/core/styles.css';
// ‼️ import dropzone styles after core package styles
import '@mantine/dropzone/styles.css';

import { useDropzone } from "react-dropzone";

const UploadFileDialog = ()  => {

  const handleFileUpload = (files : File[]) => {

    //handle text-based file upload


    //handle image upload



    //POST to DB
    //Route: 
  }

  const { getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: async (files) => {
      try {
        await handleFileUpload(files); // your API call
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
    </>
  );
}

export default UploadFileDialog
