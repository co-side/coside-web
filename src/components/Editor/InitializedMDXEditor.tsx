"use client";

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  imagePlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CreateLink,
  InsertImage,
  ListsToggle,
  Separator,
  BlockTypeSelect,
  InsertThematicBreak,
  linkDialogPlugin,
  type MDXEditorMethods,
  type MDXEditorProps,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

// Define our props interface
export interface InitializedMDXEditorProps extends MDXEditorProps {
  editorRef?: React.Ref<MDXEditorMethods>;
  markdown: string;
  onMarkdownChange?: (markdown: string) => void;
}

export default function InitializedMDXEditor({
  editorRef,
  markdown = "",
  onMarkdownChange,
  ...props
}: InitializedMDXEditorProps) {
  return (
    <MDXEditor
      ref={editorRef}
      markdown={markdown}
      onChange={onMarkdownChange}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin({
          imageUploadHandler: async (image: File) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return URL.createObjectURL(image);
          },
        }),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />
              <Separator />
              <BlockTypeSelect />
              <ListsToggle />
              <Separator />
              <CreateLink />
              <InsertImage />
              <InsertThematicBreak />
            </>
          ),
        }),
      ]}
      {...props}
    />
  );
}
