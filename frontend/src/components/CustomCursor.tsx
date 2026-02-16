import React, { useState, useEffect } from "react";
import { THEME } from "../theme"
import { useAppContext } from "./context/globalContext";
import clsx from "clsx";
import { useTheme } from "../components/context/ThemeContext"

type CustomCursorProps = {
    src?: string;
    size?: number;
};

type CursorState = 'default' | 'pointer' | 'text' | 'disabled' | 'loading';

export default function CustomCursor({ src, size = 40 }: CustomCursorProps) {
    const { lightMode } = useTheme()

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [cursorState, setCursorState] = useState<CursorState>('default');
    const [cursorSize, setCursorSize] = useState(24);

    // Define sizes and styles for different states
    // Define sizes and styles for different states
    const cursorConfig = {
        default: {
            size: 24,
            color: lightMode ? "rgba(249, 115, 22, 0.8)" : "rgba(251, 146, 60, 0.8)", // Orange in both modes
            scale: 1,
        },
        pointer: {
            size: 40,
            color: lightMode ? "rgba(249, 115, 22, 0.8)" : "rgba(251, 146, 60, 0.8)", // Solid orange
            scale: 1.2,
        },
        text: {
            size: 4,
            color: lightMode ? "rgba(249, 115, 22, 0.5)" : "rgba(251, 146, 60, 0.5)",
            scale: 1,
        },
        disabled: {
            size: 24,
            color: lightMode ? "rgba(156, 163, 175, 0.5)" : "rgba(107, 114, 128, 0.5)",
            scale: 0.8,
        },
        loading: {
            size: 32,
            color: lightMode ? "rgba(249, 115, 22, 0.8)" : "rgba(251, 146, 60, 0.8)",
            scale: 1,
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });

            // Detect what element is under the cursor
            const target = e.target as HTMLElement;

            // Check for disabled elements
            if (target.hasAttribute('disabled') || target.classList.contains('disabled')) {
                setCursorState('disabled');
            }
            // Check for clickable elements
            else if (
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.onclick ||
                target.classList.contains('cursor-pointer') ||
                window.getComputedStyle(target).cursor === 'pointer'
            ) {
                setCursorState('pointer');
            }
            // Check for text input elements
            else if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.contentEditable === 'true' ||
                window.getComputedStyle(target).cursor === 'text'
            ) {
                setCursorState('text');
            }
            // Check for loading state
            else if (target.classList.contains('loading')) {
                setCursorState('loading');
            }
            // Default state
            else {
                setCursorState('default');
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Smoothly animate cursor toward mouse
    useEffect(() => {
        let animationFrame: number;

        const animate = () => {
            setCursorPos(prev => ({
                x: prev.x + (mousePos.x - prev.x) * 0.15,
                y: prev.y + (mousePos.y - prev.y) * 0.15,
            }));
            animationFrame = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, [mousePos]);

    // Update cursor size based on state
    useEffect(() => {
        setCursorSize(cursorConfig[cursorState].size);
    }, [cursorState, lightMode]);

    const config = cursorConfig[cursorState];

    return (
        <>
            {src && (
                <img
                    src={src}
                    alt="custom cursor"
                    style={{
                        position: "fixed",
                        top: cursorPos.y,
                        left: cursorPos.x,
                        width: cursorSize,
                        height: cursorSize,
                        pointerEvents: "none",
                        transform: `translate(-50%, -50%) scale(${config.scale})`,
                        zIndex: 9999999,
                        transition: "transform 0.2s ease-out, width 0.2s ease-out, height 0.2s ease-out",
                    }}
                />
            )}

            {!src && (
                <>
                    {/* Main cursor dot */}
                    <div
                        style={{
                            position: "fixed",
                            top: cursorPos.y,
                            left: cursorPos.x,
                            width: cursorSize,
                            height: cursorSize,
                            backgroundColor: config.color,
                            borderRadius: cursorState === 'text' ? '2px' : '50%',
                            pointerEvents: "none",
                            transform: `translate(-50%, -50%) scale(${config.scale})`,
                            zIndex: 9999,
                            transition: "background-color 0.2s, transform 0.2s ease-out, width 0.2s ease-out, height 0.2s ease-out, border-radius 0.2s",
                            // Removed mixBlendMode: "difference"
                            ...(cursorState === 'loading' && {
                                animation: 'spin 1s linear infinite',
                                border: '3px solid transparent',
                                borderTopColor: config.color,
                                backgroundColor: 'transparent',
                            }),
                        }}
                    />

                    {/* Outer ring for pointer state */}
                    {cursorState === 'pointer' && (
                        <div
                            style={{
                                position: "fixed",
                                top: cursorPos.y,
                                left: cursorPos.x,
                                width: cursorSize + 20,
                                height: cursorSize + 20,
                                border: `2px solid ${config.color}`,
                                borderRadius: "50%",
                                pointerEvents: "none",
                                transform: "translate(-50%, -50%)",
                                zIndex: 9998,
                                transition: "width 0.2s ease-out, height 0.2s ease-out, opacity 0.2s",
                                opacity: 0.5,
                            }}
                        />
                    )}
                </>
            )}

            <style>
                {`
                    @keyframes spin {
                        from {
                            transform: translate(-50%, -50%) rotate(0deg);
                        }
                        to {
                            transform: translate(-50%, -50%) rotate(360deg);
                        }
                    }
                `}
            </style>
        </>
    );
}