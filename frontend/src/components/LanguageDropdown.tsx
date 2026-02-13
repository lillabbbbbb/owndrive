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
import { useAppContext } from './context/globalContext';
import { LANGUAGES } from '../types/other';
import { THEME } from "../theme"
import clsx from 'clsx';


const LanguageDropdown = () => {

    const { i18n } = useTranslation()
    const { lightMode } = useAppContext()
    const { lang, setLang } = useAppContext()
    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang)
    }

    //Note: language choice should be stored in browser's local storage

    const triggerRef = useRef<HTMLButtonElement>(null)
    const [contentWidth, setContentWidth] = useState<number | undefined>()

    useLayoutEffect(() => {
        if (triggerRef.current) {
            setContentWidth(triggerRef.current.offsetWidth)
        }
    }, [lang]) // re-run if selected changes (optional)


    return (
        <div>
            <Select value={lang} onValueChange={(lang) => {
                setLang(lang)
                changeLanguage(lang.toLocaleLowerCase())
                console.log(lang.toLowerCase())
            }} >
                <SelectTrigger ref={triggerRef} className={clsx(THEME.menu.item(lightMode),"flex [&>svg]:hidden")} >
                    <SelectValue placeholder={lang} />
                </SelectTrigger>
                <SelectContent
                    className={clsx(THEME.menu.item(lightMode),)}
                    style={{ width: contentWidth }}
                    position="popper">
                    {Object.values(LANGUAGES).map((option) => (
                        <SelectItem className={clsx(THEME.menu.item(lightMode), "[&>svg]:hidden")} key={option} value={option}>
                            {option.toUpperCase()}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default LanguageDropdown
