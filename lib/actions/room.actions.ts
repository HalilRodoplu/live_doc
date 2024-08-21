"use server"

import {nanoid} from 'nanoid';
import {liveblocks} from "@/lib/liveblocks";
import {revalidatePath} from "next/cache";
import {parseStringify} from "@/lib/utils";

export const createDocument = async ({userId, email}: CreateDocumentParams) => {
    const roomId = nanoid();

    try {
        const metadata = {
            creatorId: userId,
            email,
            title: "Untitled"
        }

        const usersAccesses: RoomAccesses = {
            [email]: ["room:write"]
        }

        const room = await liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses,
            defaultAccesses: []
        });

        revalidatePath("/")

        return parseStringify(room)

    } catch (error) {
        console.log(`Error happened while creating a room----- ${error}`);
    }
}

export const getDocument = async ({roomId, userId}: { roomId: string; userId: string }) => {

    try {
        const room = await liveblocks.getRoom(roomId);

        // TODO bring this back
        // const hasAccess = Object.keys(room.usersAccesses).includes(userId)
        //
        // if (!hasAccess) {
        //     throw new Error("You don't have access to this document");
        // }
        return parseStringify(room)
    } catch (error) {
        console.log(`Error happened while getDocument----- ${error}`);
    }

}

export const updateDocument = async (roomId: string, title: string) => {
    try {
        const updatedRoom = await liveblocks.updateRoom(roomId, {
            metadata: {
                title
            }
        });

        revalidatePath(`/documents/${roomId}`)

        return parseStringify(updatedRoom)

    } catch (error) {
        console.log("updateDocument function couldn't work----- ", error)
    }
}