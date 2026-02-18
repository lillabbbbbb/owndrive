import { useState, useLayoutEffect, useRef } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "./ui/select";
import { useTranslation } from 'react-i18next';
import { useAppContext } from './context/globalContext';
import { LANGUAGES } from '../types/other';
import { THEME } from "../theme"
import clsx from 'clsx';
import { useTheme } from "../components/context/ThemeContext"


const LanguageDropdown = () => {

    const { i18n } = useTranslation()
    const { lightMode } = useTheme()
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
        <div className={clsx( "bg-transparent")}>
            <Select value={lang} onValueChange={(lang) => {
                setLang(lang)
                changeLanguage(lang.toLocaleLowerCase())
                console.log(lang.toLowerCase())
            }}>
                <SelectTrigger className={clsx(THEME.dropdown.trigger(lightMode),
                    "flex items-center [&>svg]:hidden")}>
                    <SelectValue className={clsx(THEME.dropdown.text(lightMode))} placeholder={lang} />
                </SelectTrigger>

                <SelectContent className={clsx(THEME.dropdown.menu(lightMode),)} position="popper">
                    {Object.values(LANGUAGES).map((option) => (
                        <SelectItem
                            key={option}
                            value={option}
                            className={clsx(THEME.dropdown.item(lightMode), "[&>svg]:hidden")}
                        >
                            {option.toUpperCase()}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

        </div>
    )
}

export default LanguageDropdown
