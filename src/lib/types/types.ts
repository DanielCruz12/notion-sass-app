import { Server as NetServer, Socket } from 'net';
import { Server as SocketIoServer } from 'socket.io'
import { NextApiResponse } from 'next';
import { z } from 'zod'

export const FormSchema = z.object({
  email: z.string().describe('Email').email({ message: 'invalid email' }),
  password: z.string().describe('Password').min(1, 'Password is required'),
})

export const CreateWorkspaceFormSchema = z.object({
  workspaceName: z.string().describe('Workspace name').min(1, 'minimun of one character'),
  logo: z.any()
})

export const UploadBannerFormSchema = z.object({
  banner: z.string().describe('Banner Image'),
});

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIoServer
    }
  }
}