import { Dialog as HeadlessDialog } from "@headlessui/react";
import { useState } from "react";

type DialogProps = {
    heading?: string,
  text: string;
};
import { useTranslation } from "react-i18next";
import { THEME } from "../../theme"
import { useAppContext } from "../context/globalContext";
import clsx from "clsx";


const CustomDialog = ({ heading, text}: DialogProps) => {

  const {t} = useTranslation()
  
const { lightMode } = useAppContext()
  const [open, setOpen] = useState(true)

  return (
    <HeadlessDialog open={open} onClose={() => setOpen(false)}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <HeadlessDialog.Panel className="bg-white p-6 rounded-md shadow-md">
          <HeadlessDialog.Title className="text-lg font-bold">{heading}</HeadlessDialog.Title>
          <HeadlessDialog.Description className="mt-2">{text}</HeadlessDialog.Description>
          <button
            className={clsx(THEME.button.primary(lightMode), "mt-4 px-4 py-2 bg-red-500 text-white rounded")}
            onClick={() => setOpen(false)}
          >
            {t("close")}
          </button>
        </HeadlessDialog.Panel>
      </div>
    </HeadlessDialog>
  );
};

export default CustomDialog;