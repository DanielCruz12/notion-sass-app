import db from "./db"
import { Subscription } from "./supabase.types"

export const getUserSuscriptionStatus = async (userId: string) => {
    try {
        const data = await db.query.subscriptions.findFirst({ where: (s, { eq }) => eq(s.userId, userId) })
        if (data) return { data: data as Subscription, error: null }
        else return { data: null, error: null }
    } catch (error) {
        return { data: null, error: `Error` }
    }
}