import { useEffect } from 'react';

import { Button } from "../ui/button"
import '@mantine/core/styles.css';
// ‼️ import dropzone styles after core package styles
import '@mantine/dropzone/styles.css';
import { useAppContext } from "../context/globalContext";
import { useNavigate } from 'react-router-dom';
import { useDropzone } from "react-dropzone";
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { THEME } from "../../theme" 
import clsx from 'clsx';


const UploadFileDialog = () => {

  const { t } = useTranslation()
  const navigate = useNavigate()
const { lightMode } = useAppContext()
  const { user, setCurrentFileId, createFile, uploadFile, filesLoading, filesError } = useAppContext()

  useEffect(() => {
    toast.error(filesError)
    if (filesLoading) {
    }
  }, [filesError, filesLoading])

  const handleFileUpload = async (file: File) => {

    if (!user) return

    // Check if file is valid
    if (!file || !file.name) {
      throw new Error("Invalid file");
    }

    try {
      // Let the backend handle the file type logic
      const response = await uploadFile(file);

      if (!response) return

      const uploadedFile = response.uploadedFile
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

      <Button className={clsx(THEME.button.primary(lightMode),)} type="button" onClick={open}>
        {t("home.upload-button")}
      </Button>
    </>
  );
}

export default UploadFileDialog
