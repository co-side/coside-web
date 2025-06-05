'use client'

import dynamic from 'next/dynamic'
import { ForwardedRef, forwardRef } from "react"
import { styled } from "@mui/material/styles";
import { FormControl, FormHelperText} from "@mui/material";
import type { InitializedMDXEditorProps } from './InitializedMDXEditor'
import type { MDXEditorMethods } from '@mdxeditor/editor';

const Wrapper = styled("div")(({ theme }) => ({
  position: "relative",
  border: `1px solid ${theme.palette.grey[500]}`,
  width: "100%",
  borderRadius: "12px",
  padding: "16px 12px",

  ".mdxeditor-root-contenteditable > div": {
    padding: "16px 12px",
    minHeight: "40vh",
  },
}));

const Label = styled("label")(({ theme }) => ({
  position: "absolute",
  top: "-14px",
  padding: "4px",
  fontSize: "12px",
  background: "white",
}));

const EditorComponent = dynamic(() => import('./InitializedMDXEditor'), {
  ssr: false
});

// 修改這裡的類型定義，包含 label, helperText, error
interface ForwardRefEditorProps extends InitializedMDXEditorProps {
  label?: string;
  helperText?: string;
  error?: boolean;
}

function Editor(props: ForwardRefEditorProps, ref: ForwardedRef<MDXEditorMethods>) {
  return (
    <FormControl fullWidth={true} error={props.error}>
      <Wrapper>
        {props.label && <Label>{props.label}</Label>}
        <EditorComponent {...props} editorRef={ref} />
      </Wrapper>
      {props.helperText && <FormHelperText>{props.helperText}</FormHelperText>}
    </FormControl>
  )
}

const ForwardRefEditor = forwardRef(Editor);

export default ForwardRefEditor
