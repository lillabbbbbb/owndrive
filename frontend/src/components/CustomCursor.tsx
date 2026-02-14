import React, { useState, useEffect } from "react";
import { THEME } from "../theme"
import { useAppContext } from "./context/globalContext";
import clsx from "clsx";
import {useTheme} from "../components/context/ThemeContext"

type CustomCursorProps = {
    src?: string;           // image URL
    size?: number;         // size in pixels
};

export default function CustomCursor({ src, size = 40 }: CustomCursorProps) {


    const { lightMode } = useTheme()

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    const [cursorSize, setCursorSize] = useState(size);

    useEffect(() => {
        const hoverElements = document.querySelectorAll("a, button");
        hoverElements.forEach(el => {
            el.addEventListener("mouseenter", () => setCursorSize(60));
            el.addEventListener("mouseleave", () => setCursorSize(40));
        });
    }, []);

    // Track mouse position
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Smoothly animate cursor toward mouse
    useEffect(() => {
        let animationFrame: number;

        const animate = () => {
            setCursorPos(prev => ({
                x: prev.x + (mousePos.x - prev.x) * 0.15, // easing factor
                y: prev.y + (mousePos.y - prev.y) * 0.15,
            }));
            animationFrame = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, [mousePos]);

    return (
        <>
            {src && <img
                src={src}
                alt="custom cursor"
                style={{
                    position: "fixed",
                    top: cursorPos.y,
                    left: cursorPos.x,
                    width: size,
                    height: size,
                    pointerEvents: "none", // allow clicks to pass through
                    transform: "translate(-50%, -50%)",
                    zIndex: 9999999,
                    transition: "transform 0.1s ease-out",
                }}
            />}

            {!src && <div
                style={{
                    position: "fixed",
                    top: cursorPos.y,
                    left: cursorPos.x,
                    width: 24,
                    height: 24,
                    backgroundColor: "rgba(0, 150, 255, 0.8)",
                    borderRadius: "50%",
                    pointerEvents: "none", // let clicks pass through
                    transform: "translate(-50%, -50%)",
                    zIndex: 9999,
                    transition: "background-color 0.2s, transform 0.1s",
                    mixBlendMode: "difference", // optional modern effect
                }}
            />}
        </>
    );
}

