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
import { SUPPORTED_TEXT_TYPES, SUPPORTED_IMAGE_TYPES } from "../../types/File"
import { useNavigate } from 'react-router-dom';
import { useDropzone } from "react-dropzone";
import { useTranslation } from 'react-i18next';


const UploadFileDialog = () => {

  const {t} = useTranslation()
  const navigate = useNavigate()
  const { user, setCurrentFileId, createFile, filesLoading, filesError } = useAppContext()

  const handleFileUpload = async (file: File) => {

    if(!user) return

    // Check if file is valid
    if (!file || !file.name) {
      throw new Error("Invalid file");
    }

    // Extract filename without extension for safety
    const originalFilename = file.name.split('.').slice(0, -1).join('.');
    const fileExtension = file.name.split('.').pop() || '';

    let content = '';
    let uploadedFile;

    try {
      // Handle text-based file upload
      if (SUPPORTED_TEXT_TYPES[file.type as keyof typeof SUPPORTED_TEXT_TYPES]) {
        console.log("attempting text file upload")
        // Read text content
        content = await file.text();

        uploadedFile = await createFile({
          created_by: user._id,
          filename: `${originalFilename}`,
          file_type: `.${fileExtension}`,
          mime_type: file.type,
          content: content,
          inUse: true,
          usedBy: user._id
        });
      }
      // Handle image upload
      else if (SUPPORTED_IMAGE_TYPES[file.type as keyof typeof SUPPORTED_IMAGE_TYPES]) {
        console.log("attempting image upload")
        // For images, store as base64
        const reader = new FileReader();
        const imageContent = await new Promise<string>((resolve, reject) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        uploadedFile = await createFile({
          created_by: user._id,
          filename: `${originalFilename}`,
          file_type: `.${fileExtension}`,
          content: imageContent, // Base64 encoded image
          inUse: true,
          usedBy: user._id
        });
      }
      // Unsupported file type
      else {
        throw new Error(`Unsupported file type: ${file.type}`);
      }

      // Navigate to the uploaded file's page
      if (uploadedFile && uploadedFile._id) {
        setCurrentFileId(uploadedFile._id)
        navigate(`/${uploadedFile._id}`);
      } else {
        throw new Error("File upload failed - no ID returned");
      }

    } catch (error) {
      console.error("File upload error:", error);
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
