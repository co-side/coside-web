"use client";

import type { ForwardedRef } from "react";
import {
  headingsPlugin,
  imagePlugin,
  listsPlugin,
  linkDialogPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  CreateLink,
  InsertImage,
  ListsToggle,
  MDXEditor as InternalMDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
} from "@mdxeditor/editor";
import { styled } from "@mui/material/styles";

const Wrapper = styled("div")(({ theme }) => ({
  position: "relative",
  border: `1px solid ${theme.palette.grey[500]}`,
  width: "100%",
  borderRadius: "12px",
  padding: "16px 12px",

  ".mdxeditor-root-contenteditable > div": {
    padding: "16px 0",
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

function toolbarContents() {
  return (
    <>
      <BoldItalicUnderlineToggles />
      <InsertImage />
      <CreateLink />
      <ListsToggle options={["number", "bullet"]} />
    </>
  );
}

export default function MDXEditor({
  editorRef,
  label,
  ...props
}: { editorRef?: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps & {
    label?: string;
  }) {
  return (
    <Wrapper>
      <Label>{label}</Label>
      <InternalMDXEditor
        plugins={[
          toolbarPlugin({ toolbarContents }),
          imagePlugin({
            imageUploadHandler: () => {
              return Promise.resolve("https://picsum.photos/300/200");
            },
            imageAutocompleteSuggestions: [
              "https://picsum.photos/300/200",
              "https://picsum.photos/300",
            ],
          }),
          headingsPlugin(),
          listsPlugin(),
          linkDialogPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
        ]}
        {...props}
        ref={editorRef}
      />
    </Wrapper>
  );
}
