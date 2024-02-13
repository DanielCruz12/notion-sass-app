/* eslint-disable no-unused-vars */
'use client'

import dynamic from "next/dynamic"
import { useCallback, useRef, useState } from 'react'
import { useAppState } from '@/lib/providers/state-provider'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import { File, Folder, workspace } from '@/lib/supabase/supabase.types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { usePathname, useRouter } from 'next/navigation'

import 'quill/dist/quill.snow.css'

type QuillEditorProps = {
  dirType: 'workspace' | 'file' | 'folder'
  fileId: string
  dirDetails: workspace | File | Folder
}

var TOOLBAR_OPTIONS = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ['clean'], // remove formatting button
]

const QuillEditor: React.FC<QuillEditorProps> = ({ dirDetails }) => {
  const [quill, setQuill] = useState<any>(null)
  const supabase = createClientComponentClient()
  const { state, workspaceId, folderId, dispatch } = useAppState()
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const { user } = useSupabaseUser()
  const router = useRouter()
  const pathName = usePathname()
  const [collaborators, setCollaborators] = useState<
    {
      id: string
      email: string
      avatarUrl: string
    }[]
  >([])
  const [deletingBanner, setDeletingBanner] = useState(false)
  const [saving, setSaving] = useState(false)
  const [localCursors, setLocalCursors] = useState<any>([])
  /* const {socket, isConnected} = useSocket() */

  const wrapperRef = useCallback(async (wrapper: any) => {
    if (typeof window !== 'undefined') {
      if (wrapper === null) return
      wrapper.innerHTML = ''
      const editor = document.createElement('div')
      wrapper.append(editor)
      const Quill = (await (import('quill'))).default
      /*  const QullCursors = (await import('quill-cursors')).default
      Quill.register('modules/cursors', QullCursors) */
      const q =  new Quill(editor, {
        theme: 'snow',
        modules: {
          toolbar: TOOLBAR_OPTIONS,
          cursors: {
            transformOnTextChange: true,
          },
        },
      })
      setQuill(q)
    }
  }, [])

  return (
    <>
      <div className='relative flex flex-col items-center justify-center'>
        <div id='container' className='h-screen w-full' ref={wrapperRef}></div>
      </div>
    </>
  )
}

export default QuillEditor
