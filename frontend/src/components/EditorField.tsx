import '../editor.scss'

import { TextStyleKit } from '@tiptap/extension-text-style'
import type { Editor } from '@tiptap/react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, forwardRef } from 'react'
import { Button } from '@headlessui/react'
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useAppContext } from './context/globalContext';
import { getFileCategory } from "../../../server/src/types/file"
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import * as mammoth from "mammoth";
import { THEME } from "../theme"
import { useTheme } from "../components/context/ThemeContext"

//This was an initial thing, but now I left these in here
const BRIGHT_BUTTON_CLASS = ""
const DISABLED_BUTTON = "opacity-50 cursor-not-allowed"


const extensions = [TextStyleKit, StarterKit]

function EditorMenu({ editor }: { editor: Editor }) {

  //import variables and functions from hooks
  const { t } = useTranslation()
  const { lightMode } = useTheme()


  const jwt = localStorage.getItem("token")

  //State using Tiptap's built in useEditorState hook
  const editorState = useEditorState({
    editor,
    selector: ctx => {
      return {
        editable: (jwt ? true : false),
        isBold: ctx.editor.isActive('bold') ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive('code') ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive('paragraph') ?? false,
        isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive('heading', { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive('heading', { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,
        isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
        isBlockquote: ctx.editor.isActive('blockquote') ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      }
    },
  })



  return (
    <div className={clsx("flex-1 p-4 rounded-2xl", "control-group")} >
      <div className="button-group">
        <Button className={clsx(THEME.button.editor(lightMode),
          BRIGHT_BUTTON_CLASS,
          !editor?.isEditable && DISABLED_BUTTON,
          editorState.isBold && 'is-active'
        )}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor?.isEditable}
        >
          Bold
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor?.isEditable}
          className={clsx(THEME.button.editor(lightMode),
            BRIGHT_BUTTON_CLASS,
            !editor?.isEditable && DISABLED_BUTTON,
            editorState.isItalic && 'is-active'
          )}
        >
          Italic
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor?.isEditable}
          className={clsx(THEME.button.editor(lightMode),
            BRIGHT_BUTTON_CLASS,
            !editor?.isEditable && DISABLED_BUTTON,
            editorState.isStrike && 'is-active'
          )}


        >
          Strike
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor?.isEditable}
          className={clsx(THEME.button.editor(lightMode),
            BRIGHT_BUTTON_CLASS,
            !editor?.isEditable && DISABLED_BUTTON,
            editorState.isCode && 'is-active'
          )}

        >
          Code
        </Button>
        <button className={clsx(THEME.button.editor(lightMode), !editor?.isEditable && DISABLED_BUTTON,)} onClick={() => editor.chain().focus().unsetAllMarks().run()} disabled={!editor?.isEditable}>Clear marks</button>
        <button className={clsx(THEME.button.editor(lightMode), !editor?.isEditable && DISABLED_BUTTON,)} onClick={() => editor.chain().focus().clearNodes().run()} disabled={!editor?.isEditable}>Clear nodes</button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          disabled={!editor?.isEditable}
          className={clsx(THEME.button.editor(lightMode),
            BRIGHT_BUTTON_CLASS,
            !editor?.isEditable && DISABLED_BUTTON,
            editorState.isParagraph && 'is-active'
          )}
        >
          Paragraph
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          disabled={!editor?.isEditable}
          className={clsx(THEME.button.editor(lightMode),
            BRIGHT_BUTTON_CLASS,
            !editor?.isEditable && DISABLED_BUTTON,
            editorState.isHeading1 && 'is-active'
          )}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={!editor?.isEditable}
          className={clsx(THEME.button.editor(lightMode),
            BRIGHT_BUTTON_CLASS,
            !editor?.isEditable && DISABLED_BUTTON,
            editorState.isHeading2 && 'is-active'
          )}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          disabled={!editor?.isEditable}
          className={clsx(THEME.button.editor(lightMode),
            BRIGHT_BUTTON_CLASS,
            !editor?.isEditable && DISABLED_BUTTON,
            editorState.isHeading3 && 'is-active'
          )}
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          disabled={!editor?.isEditable}
          className={clsx(THEME.button.editor(lightMode),
            BRIGHT_BUTTON_CLASS,
            !editor?.isEditable && DISABLED_BUTTON,
            editorState.isHeading4 && 'is-active'
          )}
        >
          H4
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          disabled={!editor?.isEditable}
          className={clsx(THEME.button.editor(lightMode),
            BRIGHT_BUTTON_CLASS,
            !editor?.isEditable && DISABLED_BUTTON,
            editorState.isHeading5 && 'is-active'
          )}
        >
          H5
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          disabled={!editor?.isEditable}
          className={clsx(THEME.button.editor(lightMode),
            BRIGHT_BUTTON_CLASS,
            !editor?.isEditable && DISABLED_BUTTON,
            editorState.isHeading6 && 'is-active'
          )}
        >
          H6
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={!editor?.isEditable}
          className={clsx(THEME.button.editor(lightMode),
            BRIGHT_BUTTON_CLASS,
            !editor?.isEditable && DISABLED_BUTTON,
            editorState.isBulletList && 'is-active'
          )}
        >
          Bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={!editor?.isEditable}
          className={clsx(THEME.button.editor(lightMode),
            BRIGHT_BUTTON_CLASS,
            !editor?.isEditable && DISABLED_BUTTON,
            editorState.isOrderedList && 'is-active'
          )}
        >
          Ordered list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          disabled={!editor?.isEditable}
          className={clsx(THEME.button.editor(lightMode),
            BRIGHT_BUTTON_CLASS,
            !editor?.isEditable && DISABLED_BUTTON,
            editorState.isCodeBlock && 'is-active'
          )}
        >
          Code block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={!editor?.isEditable}
          className={clsx(THEME.button.editor(lightMode),
            BRIGHT_BUTTON_CLASS,
            !editor?.isEditable && DISABLED_BUTTON,
            editorState.isBlockquote && 'is-active'
          )}
        >
          Blockquote
        </button>
        <button className={clsx(THEME.button.editor(lightMode), !editor?.isEditable && DISABLED_BUTTON,)} onClick={() => editor.chain().focus().setHorizontalRule().run()} disabled={!editor?.isEditable}>Horizontal rule</button>
        <button className={clsx(THEME.button.editor(lightMode), !editor?.isEditable && DISABLED_BUTTON,)} onClick={() => editor.chain().focus().setHardBreak().run()} disabled={!editor?.isEditable}>Hard break</button>
        <button className={clsx(THEME.button.editor(lightMode), !editor?.isEditable && DISABLED_BUTTON,)} onClick={() => editor.chain().focus().undo().run()} disabled={!editor?.isEditable}>
          Undo
        </button>
        <button className={clsx(THEME.button.editor(lightMode), !editor?.isEditable && DISABLED_BUTTON,)} onClick={() => editor.chain().focus().redo().run()} disabled={!editor?.isEditable}>
          Redo
        </button>
      </div>
    </div>
  )
}

type EditorFieldProps = {
  content: string,
  setContent: (content: string) => void,
  editable: boolean
}
const EditorField = forwardRef<HTMLDivElement, EditorFieldProps>(({ content, setContent, editable }, ref) => {
  //import variables and functions from hooks
  const { currentFile } = useAppContext()
  const { lightMode } = useTheme()
  console.log(currentFile)

  //States
  const [url, setUrl] = useState<string | null>(null)
  const [numPages, setNumPages] = useState<number>(0);

  //React's custom state for the editor
  const editor = useEditor({
    extensions,
    editable,
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML()); // save the current content as HTML
    },
  })

  //Manually rerender when content is changed
  useEffect(() => {
    if (!editor) return;

    // Only update if editor content is different
    if (content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);


  useEffect(() => {
    if (!editor) {
      return undefined
    }

    editor.setEditable(editable)
  }, [editor, editable])

  if (!editor) {
    return null
  }

  //This was part of an earlier version too. 
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

  useEffect(() => {
    if (!currentFile) {
      setContent(""); // or null
      return;
    }

    setContent("");
    const category = getFileCategory(currentFile.file.mime_type);
    async function loadFile() {
      switch (category) {
        case "editable":
          if (currentFile?.file.mime_type === "application/json") {
            setContent(currentFile.file.content ?? "");
            const content: string = "<your string>";
            const encoder = new TextEncoder();
            const buffer = encoder.encode(content); // Uint8Array
            const arrayBuffer = buffer.buffer; // ✅ Now you have ArrayBuffer
            const { value: html } = await mammoth.convertToHtml({ arrayBuffer });
            setContent(html);
          } else {
            const text = currentFile?.file.content;
            setContent(text!);
          }
          break;

        case "image":
          if (currentFile && currentFile.base64data) {
            const url = `data:${currentFile.file.mime_type};base64,${currentFile.base64data}`;
            setUrl(url); //
          }
          break;

        case "viewOnly":
          if (currentFile && currentFile.file.content) {
            const url = `data:${currentFile.file.mime_type};base64,${currentFile.file.content}`;
            setUrl(url); //
          }
          break;

        default:
          if (currentFile && currentFile.base64data) {
            const url = `data:${currentFile.file.mime_type};base64,${currentFile.base64data}`;
            setUrl(url); //
          }
          break;
      }
    }

    loadFile();

    // Cleanup blob URLs for images/view-only files
    return () => {
      if (url && (category === "image" || category === "viewOnly")) {
        URL.revokeObjectURL(url);
      }
    };
  }, [currentFile]);

  if (!currentFile) {
    return (
      <>
        <div className={clsx(THEME.editorField.base(lightMode), THEME.editorField.hover(lightMode))}>
          <EditorMenu editor={editor} />
          <div ref={ref}>
            <EditorContent editor={editor} className="tiptap-editor prose prose-slate dark:prose-invert max-h-full" />
          </div>
          <div>Word count: {content ? content.trim().split(/\s+/).filter(Boolean).length : 0}</div>
        </div>
      </>)
  }

  const category = getFileCategory(currentFile.file.mime_type);

  switch (category) {
    case "editable":
      if (currentFile.file.mime_type === "application/json") {
        return (
          <div>
            <EditorMenu editor={editor} />
            <div className={clsx(THEME.editorField.base(lightMode), THEME.text.secondary(lightMode))} ref={ref}>
              <EditorContent editor={editor} className="tiptap-editor prose prose-slate dark:prose-invert" />
            </div>
            <div className={clsx(THEME.text.secondary(lightMode))} >Word count: {content ? content.trim().split(/\s+/).filter(Boolean).length : 0}</div>
          </div>
        );
      } else {
        console.log("Non-JSON editable file skipped")
        return (<p>Non-JSON editable file skipped</p>)
      }
      break;

    case "image":
      return <img src={url || undefined} alt={currentFile.file.filename} style={{ maxWidth: "100%" }} />;

    case "viewOnly":
      if (currentFile.file.file_type === "application/pdf") {
        return (
          <Document file={content} onLoadSuccess={({ numPages: string }) => setNumPages(numPages)}>
            {Array.from(new Array(numPages), (_, index) => (
              <Page key={index} pageNumber={index + 1} />
            ))}
          </Document>
        );
      } else {
        return (
          <a href={content || undefined} target="_blank" rel="noopener noreferrer">
            View / Download {currentFile.file.filename}
          </a>
        );
      }

    default:
      return (
        <a href={content || undefined} target="_blank" rel="noopener noreferrer">
          Download {currentFile.file.filename}
        </a>
      );


  }

  return (
    <>

    </>
  )
})

export default EditorField