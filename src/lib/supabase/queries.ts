'use server';

import { and, eq, notExists } from "drizzle-orm";
import db from "./db"
import { Folder, Subscription, workspace } from "./supabase.types"
import { validate } from 'uuid'
import { folders, users, workspaces, files } from "../../../migrations/schema";
import { collaborators } from './schema'
export const getUserSuscriptionStatus = async (userId: string) => {
    try {
        const data = await db.query.subscriptions.findFirst({ where: (s, { eq }) => eq(s.userId, userId) })
        if (data) return { data: data as Subscription, error: null }
        else return { data: null, error: null }
    } catch (error) {
        return { data: null, error: `Error` }
    }
}

export const getFolders = async (folderId: string) => {
    const isValid = validate(folderId)
    if (!isValid)
        return {
            data: null,
            error: 'Error'
        }
    try {
        const res: Folder[] | [] = await db.select().from(folders).orderBy(folders.createdAt)
            .where(eq(folders.id, folderId))
        return { data: res, error: null }
    } catch (error) {
        return { data: null, error: 'Error' };
    }
}

export const getPrivateWorkspaces = async (userId: string) => {
    if (!userId) return null
    const privateWorkspaces = await db.select({
        id: workspaces.id,
        createdAt: workspaces.createdAt,
        workspaceOwner: workspaces.workspaceOwner,
        title: workspaces.title,
        iconId: workspaces.iconId,
        data: workspaces.data,
        inTrash: workspaces.inTrash,
        logo: workspaces.logo,
        bannerUrl: workspaces.bannerUrl,
    })
        .from(workspaces).where((and(notExists(db.select()
            .from(collaborators)
            .where(eq(collaborators.workspaceId, workspaces.id))), eq(workspaces.workspaceOwner, userId)
        )
        )) as workspace[];
    return privateWorkspaces;
}

export const getCollaboratoratingWorkspaces = async (userId: string) => {
    if (!userId) return null
    const collaboratedWorkspaces = await db.select({
        id: workspaces.id,
        createdAt: workspaces.createdAt,
        workspaceOwner: workspaces.workspaceOwner,
        title: workspaces.title,
        iconId: workspaces.iconId,
        data: workspaces.data,
        inTrash: workspaces.inTrash,
        logo: workspaces.logo,
    }).from(users)
        .innerJoin(collaborators, eq(users.id, collaborators.id))
        .innerJoin(workspaces, eq(collaborators.workspaceId, workspaces.id))
        .where(eq(users.id, userId)) as workspace[]
    return collaboratedWorkspaces
}

export const getSharedWorkspaces = async (userId: string) => {
    if (!userId) return null
    const sharedWorkspaces = await db.selectDistinct({
        id: workspaces.id,
        createdAt: workspaces.createdAt,
        workspaceOwner: workspaces.workspaceOwner,
        title: workspaces.title,
        iconId: workspaces.iconId,
        data: workspaces.data,
        inTrash: workspaces.inTrash,
        logo: workspaces.logo,
    }).from(workspaces).orderBy(workspaces.createdAt)
        .innerJoin(collaborators, eq(workspaces.id, collaborators.workspaceId))
        .where(eq(workspaces.workspaceOwner, userId)) as workspace[]
    return sharedWorkspaces
}

export const getFiles = async (folderId: any) => {
    const isValid = validate(folderId);
    if (!isValid) return { data: null, error: 'Error' };
    try {
        const results = (await db
            .select()
            .from(files)
            .orderBy(files.createdAt)
            .where(eq(files.folderId, folderId)))
        return { data: results, error: null };
    } catch (error) {
        console.log(error);
        return { data: null, error: 'Error' };
    }

}