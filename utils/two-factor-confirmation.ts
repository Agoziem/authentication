import { db } from "@/lib/db";

export const getTwoFactorConfirmationbyUserId = async (userId: string) => {
    try {
        const twoFactorConfirmation = await db.twoFactorComfirmation.findUnique({
        where: {
            userId,
        },
        });
        return twoFactorConfirmation;
    } catch (error) {
        return null;
    }
};