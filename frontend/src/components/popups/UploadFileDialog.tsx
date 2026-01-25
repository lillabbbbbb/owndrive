import { useState } from 'react';

import { Button } from "../ui/button"
import { Group, Text } from '@mantine/core';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import '@mantine/core/styles.css';
// ‼️ import dropzone styles after core package styles
import '@mantine/dropzone/styles.css';

import { useDropzone } from "react-dropzone";

const UploadFileDialog = ()  => {

  const { getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
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
