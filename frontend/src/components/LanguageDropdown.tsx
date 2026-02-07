import { useState, useLayoutEffect, useRef } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "./ui/select";
import { changeLanguage } from "i18next"
import { useTranslation } from 'react-i18next';

const languageOptions = ["en", "fi", "hu"]

const LanguageDropdown = () => {

    const {i18n} = useTranslation()
    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang)
    }

    //Note: language choice should be stored in browser's local storage

    const [selected, setSelected] = useState<string>(languageOptions[0])
    const triggerRef = useRef<HTMLButtonElement>(null)
    const [contentWidth, setContentWidth] = useState<number | undefined>()

    useLayoutEffect(() => {
    if (triggerRef.current) {
      setContentWidth(triggerRef.current.offsetWidth)
    }
  }, [selected]) // re-run if selected changes (optional)


    return (
        <div>
            <Select value={selected} onValueChange={(lang) => {
                setSelected(lang)
                changeLanguage(lang.toLocaleLowerCase())
                console.log(lang.toLowerCase())
                }} >
                <SelectTrigger ref={triggerRef} className="flex [&>svg]:hidden">
                    <SelectValue placeholder={selected} />
                </SelectTrigger>
                <SelectContent
                className=""
                style={{ width: contentWidth }}
                position="popper">
                    {languageOptions.map((option) => (
                        <SelectItem className="[&>svg]:hidden" key={option} value={option}>
                            {option.toUpperCase()}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default LanguageDropdown
