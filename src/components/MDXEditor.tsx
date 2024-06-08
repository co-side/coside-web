'use client'

import type { ForwardedRef } from 'react'
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
} from '@mdxeditor/editor'

function toolbarContents() {
  return (
    <>
      <BoldItalicUnderlineToggles />
      <InsertImage />
      <CreateLink />
      <ListsToggle options={['number', 'bullet']} />
    </>
  )
}

export default function MDXEditor({
  editorRef,
  ...props
}: { editorRef?: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <InternalMDXEditor
      plugins={[
        toolbarPlugin({ toolbarContents }),
        headingsPlugin(),
        imagePlugin(),
        listsPlugin(),
        linkDialogPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
      ]
      }
      {...props}
      ref={editorRef}
    />
  )
}
