/* eslint-disable no-unused-vars */
'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
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

const QuillEditor: React.FC<QuillEditorProps> = ({
  dirDetails,
  fileId,
  dirType,
}) => {
  const [quill, setQuill] = useState<any>(null)
  const supabase = createClientComponentClient()
  const { state, workspaceId, folderId, dispatch } = useAppState()
  const pathname = usePathname()
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const { user } = useSupabaseUser()
  const router = useRouter()
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

  const details = useMemo(() => {
    let selectedDir
    if (dirType === 'file') {
      selectedDir = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === folderId)
        ?.files.find((file) => file.id === fileId)
    }
    if (dirType === 'folder') {
      selectedDir = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === fileId)
    }
    if (dirType === 'workspace') {
      selectedDir = state.workspaces.find(
        (workspace) => workspace.id === fileId
      )
    }
    if (selectedDir) {
      return selectedDir
    }
    return {
      title: dirDetails.title,
      iconId: dirDetails.iconId,
      createdAt: dirDetails.createdAt,
      data: dirDetails.data,
      inTrash: dirDetails.inTrash,
      bannerUrl: dirDetails.bannerUrl,
    } as workspace | Folder | File
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, workspaceId, folderId])

  const breadCrumbs = useMemo(() => {
    if (!pathname || !state.workspaces || !workspaceId) return
    const segments = pathname
      .split('/')
      .filter((val) => val !== 'dashboard' && val)
    const workspaceDetails = state.workspaces.find(
      (workspace) => workspace.id === workspaceId
    )
    const workspaceBreadCrumb = workspaceDetails
      ? `${workspaceDetails.iconId} ${workspaceDetails.title}`
      : ''
    if (segments.length === 1) {
      return workspaceBreadCrumb
    }

    const folderSegment = segments[1]
    const folderDetails = workspaceDetails?.folders.find(
      (folder) => folder.id === folderSegment
    )
    const folderBreadCrumb = folderDetails
      ? `/ ${folderDetails.iconId} ${folderDetails.title}`
      : ''

    if (segments.length === 2) {
      return `${workspaceBreadCrumb} ${folderBreadCrumb}`
    }

    const fileSegment = segments[2]
    const fileDetails = folderDetails?.files.find(
      (file) => file.id === fileSegment
    )
    const fileBreadCrumb = fileDetails
      ? `/ ${fileDetails.iconId} ${fileDetails.title}`
      : ''

    return `${workspaceBreadCrumb} ${folderBreadCrumb} ${fileBreadCrumb}`
  }, [state, pathname, workspaceId])

  const wrapperRef = useCallback(async (wrapper: any) => {
    if (typeof window !== 'undefined') {
      if (wrapper === null) return
      wrapper.innerHTML = ''
      const editor = document.createElement('div')
      wrapper.append(editor)
      const Quill = (await import('quill')).default;
      /*  const QuillCursors = (await import('quill-cursors')).default;
      Quill.register('modules/cursors', QuillCursors); */
      const q = new Quill(editor, {
        theme: 'snow',
        modules: { toolbar: TOOLBAR_OPTIONS },
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
