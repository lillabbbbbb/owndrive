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
import { useNavigate } from 'react-router-dom';
import { useDropzone } from "react-dropzone";
import { useTranslation } from 'react-i18next';


const UploadFileDialog = () => {

  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, setCurrentFileId, createFile, uploadFile, filesLoading, filesError } = useAppContext()

  const handleFileUpload = async (file: File) => {

    if (!user) return

    // Check if file is valid
    if (!file || !file.name) {
      throw new Error("Invalid file");
    }

    try {
      // Let the backend handle the file type logic
        const response = await uploadFile(file);

        if(!response) return

      const uploadedFile = response.file
      const category = response.category
      
      // Navigate to the uploaded file's page
      if (uploadedFile && uploadedFile._id) {
        setCurrentFileId(uploadedFile._id)
        navigate(`/${user._id}/${uploadedFile._id}`);
      } else {
        throw new Error("File upload failed - no ID returned");
      }

    } catch (error) {
      console.log("File upload error:", error);
      // Handle error (show notification, etc.)
      throw error;
    }
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
        {t("home.upload-button")}
      </Button>

      {filesError && <CustomDialog heading="Error" text={filesError} />}
      {filesLoading && <p>{t("Loading...")}</p>}
    </>
  );
}

export default UploadFileDialog
