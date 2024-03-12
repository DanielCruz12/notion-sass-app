/* eslint-disable no-unused-vars */
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAppState } from '@/lib/providers/state-provider'
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider'
import { File, Folder, workspace } from '@/lib/supabase/supabase.types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { usePathname, useRouter } from 'next/navigation'
import 'quill/dist/quill.snow.css'
import { XCircleIcon } from 'lucide-react'
import { Button } from '../ui/button'
import EmojiPicker from '../global/emoji-picker'
import Image from 'next/image'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'
import {
  deleteFile,
  deleteFolder,
  getFileDetails,
  getFolderDetails,
  getWorkspaceDetails,
  updateFile,
  updateFolder,
  updateWorkspace,
} from '@/lib/supabase/queries'
import BannerUpload from '../banner-upload/banner-upload'
import { useSocket } from '@/lib/providers/socket-provider'

type QuillEditorProps = {
  dirType: 'workspace' | 'file' | 'folder'
  fileId: string
  dirDetails: workspace | File | Folder
}

var TOOLBAR_OPTIONS = [
  ['bold', 'italic', 'underline', 'strike', 'image', 'video'], // toggled buttons
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

  const { socket, isConnected } = useSocket()
  console.log(socket)

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
      const Quill = (await import('quill')).default
      /*  const QuillCursors = (await import('quill-cursors')).default;
      Quill.register('modules/cursors', QuillCursors); */
      const q = new Quill(editor, {
        theme: 'snow',
        modules: { toolbar: TOOLBAR_OPTIONS },
      })
      setQuill(q)
    }
  }, [])

  const iconOnChange = (icon: string) => {
    if (!fileId) return
    if (dirType === 'workspace') {
      dispatch({
        type: 'UPDATE_WORKSPACE',
        payload: { workspace: { iconId: icon }, workspaceId: fileId },
      })
      updateWorkspace({ iconId: icon }, fileId)
    }
    if (dirType === 'folder') {
      if (!workspaceId) return
      dispatch({
        type: 'UPDATE_FOLDER',
        payload: {
          folder: { iconId: icon },
          workspaceId: workspaceId,
          folderId: fileId,
        },
      })
      updateFolder({ iconId: icon }, fileId)
    }
    if (dirType === 'file') {
      if (!workspaceId || !folderId) return
      dispatch({
        type: 'UPDATE_FILE',
        payload: {
          file: { iconId: icon },
          workspaceId,
          folderId,
          fileId,
        },
      })
      updateFolder({ iconId: icon }, fileId)
    }
  }

  const deleteFileHandler = async () => {
    if (dirType === 'file') {
      if (!folderId || !workspaceId) return
      dispatch({
        type: 'DELETE_FILE',
        payload: { fileId, folderId, workspaceId },
      })
      await deleteFile(fileId)
      router.replace(`/dashboard/${workspaceId}`)
    }
    if (dirType === 'folder') {
      if (!workspaceId) return
      dispatch({
        type: 'DELETE_FOLDER',
        payload: { folderId: fileId, workspaceId },
      })
      await deleteFolder(fileId)
      router.replace(`/dashboard/${workspaceId}`)
    }
  }
  const restoreFileHandler = async () => {
    if (dirType === 'file') {
      if (!folderId || !workspaceId) return
      dispatch({
        type: 'UPDATE_FILE',
        payload: { file: { inTrash: '' }, fileId, folderId, workspaceId },
      })
      await updateFile({ inTrash: '' }, fileId)
    }
    if (dirType === 'folder') {
      if (!workspaceId) return
      dispatch({
        type: 'UPDATE_FOLDER',
        payload: { folder: { inTrash: '' }, folderId: fileId, workspaceId },
      })
      await updateFolder({ inTrash: '' }, fileId)
    }
  }
  const deleteBanner = async () => {
    if (!fileId) return
    setDeletingBanner(true)
    if (dirType === 'file') {
      if (!folderId || !workspaceId) return
      dispatch({
        type: 'UPDATE_FILE',
        payload: { file: { bannerUrl: '' }, fileId, folderId, workspaceId },
      })
      await supabase.storage.from('file-banners').remove([`banner-${fileId}`])
      await updateFile({ bannerUrl: '' }, fileId)
    }
    if (dirType === 'folder') {
      if (!workspaceId) return
      dispatch({
        type: 'UPDATE_FOLDER',
        payload: { folder: { bannerUrl: '' }, folderId: fileId, workspaceId },
      })
      await supabase.storage.from('file-banners').remove([`banner-${fileId}`])
      await updateFolder({ bannerUrl: '' }, fileId)
    }
    if (dirType === 'workspace') {
      dispatch({
        type: 'UPDATE_WORKSPACE',
        payload: {
          workspace: { bannerUrl: '' },
          workspaceId: fileId,
        },
      })
      await supabase.storage.from('file-banners').remove([`banner-${fileId}`])
      await updateWorkspace({ bannerUrl: '' }, fileId)
    }
    setDeletingBanner(false)
  }

  useEffect(() => {
    if (!fileId) return
    let selectedDir
    const fetchInformation = async () => {
      if (dirType === 'file') {
        const { data: selectedDir, error } = await getFileDetails(fileId)
        if (error || !selectedDir) {
          return router.replace('/dashboard')
        }

        if (!selectedDir[0]) {
          if (!workspaceId) return
          return router.replace(`/dashboard/${workspaceId}`)
        }
        if (!workspaceId || quill === null) return
        if (!selectedDir[0].data) return
        quill.setContents(JSON.parse(selectedDir[0].data || ''))
        dispatch({
          type: 'UPDATE_FILE',
          payload: {
            file: { data: selectedDir[0].data },
            fileId,
            folderId: selectedDir[0].folderId ?? '',
            workspaceId,
          },
        })
      }
      if (dirType === 'folder') {
        const { data: selectedDir, error } = await getFolderDetails(fileId)
        if (error || !selectedDir) {
          return router.replace('/dashboard')
        }

        if (!selectedDir[0]) {
          router.replace(`/dashboard/${workspaceId}`)
        }
        if (quill === null) return
        if (!selectedDir[0].data) return
        quill.setContents(JSON.parse(selectedDir[0].data || ''))
        dispatch({
          type: 'UPDATE_FOLDER',
          payload: {
            folderId: fileId,
            folder: { data: selectedDir[0].data },
            workspaceId: selectedDir[0].workspaceId,
          },
        })
      }
      if (dirType === 'workspace') {
        const { data: selectedDir, error } = await getWorkspaceDetails(fileId)
        if (error || !selectedDir) {
          return router.replace('/dashboard')
        }
        if (!selectedDir[0] || quill === null) return
        if (!selectedDir[0].data) return
        quill.setContents(JSON.parse(selectedDir[0].data || ''))
        dispatch({
          type: 'UPDATE_WORKSPACE',
          payload: {
            workspace: { data: selectedDir[0].data },
            workspaceId: fileId,
          },
        })
      }
    }
    fetchInformation()
  }, [fileId, workspaceId, quill, dirType])

  return (
    <ScrollArea className='h-screen overflow-auto'>
      <div className='relative max-w-[1000px]'>
        {details.inTrash && (
          <article
            className='z-40 
        flex 
        flex-col 
        flex-wrap  
        items-center 
        justify-center 
        gap-4 
        bg-[#EB5757] 
        py-2 
        md:flex-row'
          >
            <div
              className='flex 
          flex-col 
          items-center 
          justify-center 
          gap-2 
          md:flex-row'
            >
              <span className='text-white'>
                This {dirType} is in the trash.
              </span>
              <Button
                size='sm'
                variant='outline'
                className='border-white
              bg-transparent
              text-white
              hover:bg-white
              hover:text-[#EB5757]
              '
                onClick={restoreFileHandler}
              >
                Restore
              </Button>

              <Button
                size='sm'
                variant='outline'
                className='border-white
              bg-transparent
              text-white
              hover:bg-white
              hover:text-[#EB5757]
              '
                onClick={deleteFileHandler}
              >
                Delete
              </Button>
            </div>
            <span className='text-sm text-white'>{details.inTrash}</span>
          </article>
        )}
        <div
          className='flex 
      flex-col-reverse 
      justify-center 
      p-8 
      sm:flex-row 
      sm:items-center 
      sm:justify-between 
      sm:p-2'
        >
          <div>{breadCrumbs}</div>
          <div className='flex items-center gap-4'>
            <div className='flex h-10 items-center justify-center'>
              {collaborators?.map((collaborator) => (
                <TooltipProvider key={collaborator.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar
                        className='
                  -ml-3 
                  flex 
                  h-8 
                  w-8 
                  items-center 
                  justify-center 
                  rounded-full 
                  border-2 
                  border-white 
                  bg-background
                  '
                      >
                        <AvatarImage
                          src={
                            collaborator.avatarUrl ? collaborator.avatarUrl : ''
                          }
                          className='rounded-full'
                        />
                        <AvatarFallback>
                          {collaborator.email.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>{collaborator.email}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
            {saving ? (
              <Badge
                variant='secondary'
                className='right-4 top-4
              z-50
              bg-orange-600
              text-white
              '
              >
                Saving...
              </Badge>
            ) : (
              <Badge
                variant='secondary'
                className='right-4 
              top-4
            z-50
            bg-emerald-600
            text-white
            '
              >
                Saved
              </Badge>
            )}
          </div>
        </div>
      </div>
      {details.bannerUrl && (
        <div className='relative h-[200px] w-full text-white transition-all hover:opacity-50'>
          <Image
            src={
              supabase.storage
                .from('file-banners')
                .getPublicUrl(details.bannerUrl).data.publicUrl
            }
            fill
            className='h-20 w-full object-cover transition-opacity duration-300 hover:cursor-pointer md:h-48'
            alt='Banner Image'
          />

          <BannerUpload
            id={fileId}
            dirType={dirType}
            className='absolute top-0 z-50 mt-2 h-20 w-full rounded-md p-2 text-sm text-white transition-all md:h-48'
          >
            {details.bannerUrl ? 'Update Banner' : 'Add Banner'}
          </BannerUpload>
        </div>
      )}
      <div
        className='relative
      mt-2
      flex
      flex-col
      items-center
      justify-center 
    '
      >
        <div
          className='flex 
      w-full 
      flex-row 
      self-center
       px-7 
       lg:my-8'
        >
          <div className='flex w-full flex-row'>
            <div className='text-[60px]'>
              <EmojiPicker getValue={iconOnChange}>
                <div
                  className='flex
             
              w-[100px]
              cursor-pointer
              items-center
              justify-center
              rounded-xl
              transition-colors
              hover:bg-muted'
                >
                  {details.iconId}
                </div>
              </EmojiPicker>
            </div>

            <span
              className='
          pt-3
          text-3xl
          font-bold
          text-muted-foreground
        '
            >
              {details.title}
            </span>
          </div>

          {!details.bannerUrl ? (
            <BannerUpload
              id={fileId}
              dirType={dirType}
              className='absolute z-50 mt-2 h-20 w-full rounded-md p-2 text-sm transition-all hover:text-white md:h-48'
            >
              {'Add Banner'}
            </BannerUpload>
          ) : null}

          <div>
            {details.bannerUrl && (
              <Button
                disabled={deletingBanner}
                onClick={deleteBanner}
                variant='ghost'
                className=' 
              gap-2
              rounded-md
              text-sm
              text-muted-foreground
              hover:bg-background'
              >
                <XCircleIcon size={16} />
                <span className='font-normal'>Remove Banner</span>
              </Button>
            )}
          </div>
        </div>
        <div id='container' className=' max-w-[1000px] ' ref={wrapperRef}></div>
      </div>
    </ScrollArea>
  )
}

export default QuillEditor
