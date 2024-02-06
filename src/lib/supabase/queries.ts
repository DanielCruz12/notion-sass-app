'use server';

import { and, eq, ilike, notExists } from "drizzle-orm";
import db from "./db"
import { Folder, Subscription, User, workspace } from "./supabase.types"
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

export const getFolders = async (workspaceId: string) => {
    const isValid = validate(workspaceId)
    if (!isValid)
        return {
            data: null,
            error: 'Error'
        }
    try {
        const res: Folder[] | [] = await db.select().from(folders).orderBy(folders.createdAt)
            .where(eq(folders.workspaceId, workspaceId))
        return { data: res, error: null }
    } catch (error) {
        return { data: null, error: 'Error' };
    }
}

export const updateFolder = async (
    folder: Partial<Folder>,
    folderId: string
) => {
    try {
        await db.update(folders).set(folder).where(eq(folders.id, folderId));
        return { data: null, error: null };
    } catch (error) {
        return { data: null, error: 'Error' };
    }
};

export const updateFile = async (file: any, fileId: string) => {
    try {
        // eslint-disable-next-line no-unused-vars
        const res = await db.update(files).set(file).where(eq(files.id, fileId))
        return { data: null, error: null }
    } catch (error) {
        return { data: null, error: 'Error' }
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

export const createFile = async (file: any) => {
    try {
        await db.insert(files).values(file);
        return { data: null, error: null };
    } catch (error) {
        return { data: null, error: 'Error' };
    }
};

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
        return { data: null, error: 'Error' };
    }
}

export const createWorkspace = async (workspace: workspace) => {
    try {
        const response = await db.insert(workspaces).values(workspace);
        return { data: response, error: null };
    } catch (error) {
        return { data: null, error: 'Error' };
    }
};

export const getUserSubscriptionStatus = async (userId: string) => {
    try {
        const data = await db.query.subscriptions.findFirst({
            where: (s, { eq }) => eq(s.userId, userId),
        });
        if (data) return { data: data as Subscription, error: null };
        else return { data: null, error: null };
    } catch (error) {
        return { data: null, error: `Error` };
    }
};

export const addCollaborators = async (users: User[], workspaceId: any) => {
    const response = users.forEach(async (user: User) => {
        const userExists = await db.query.workspaces.findFirst({
            where: (u: any, { eq }) =>
                and(eq(u.userId, user.id), eq(u.workspaceId, workspaceId)),
        });
        if (!userExists)
            await db.insert(collaborators).values({ workspaceId, userId: user.id });
    });
    return response
};

export const createFolder = async (folder: Folder) => {
    try {
        // eslint-disable-next-line no-unused-vars
        const res = await db.insert(folders).values(folder)
        return { data: null, error: null }
    } catch (error) {
        return { data: null, error: "No saved folder" }
    }
}

export const getUsersFromSearch = async (email: string) => {
    if (!email) return []
    const accounts = db.select().from(users).where(ilike(users.email, `${email}%`))
    return accounts
}

