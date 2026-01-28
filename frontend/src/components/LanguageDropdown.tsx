import React, { useState, useLayoutEffect, useRef } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "./ui/select";

const languageOptions = ["en", "fi"]

const LanguageDropdown = () => {

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
                setSelected
                //i18n.changeLanguage(lang)
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
