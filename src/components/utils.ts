import { Room, RoomSet } from '../type'

export const getPlayerCurrentRoom = (address: string, roomSet: RoomSet): Room | null => {
        let result: Room | null = null
        const resultWithUndefined: Room | undefined = roomSet.find(room =>
            typeof room.players.find(player =>
                player.socketUser.user.address === address) != 'undefined')
        if (typeof resultWithUndefined != 'undefined') {
            result = resultWithUndefined
        }
        return result
    }

export const getPlayerCurrentRoomIndex = (address: string, roomSet: RoomSet): number => {
        const result: number = roomSet.findIndex(room =>
            typeof room.players.find(player =>
                player.socketUser.user.address === address) != 'undefined')
        return result
    }

export const getPlayerCurrentPositionInRoom = (address: string, roomSet: RoomSet): number => {
        const currentRoom: Room | null = getPlayerCurrentRoom(address, roomSet)
        let result = -1
        if (currentRoom != null) {
            result = currentRoom.players.findIndex(player =>
                player.socketUser.user.address === address)
        }
        return result
    }

    export const getPlayerCurrentPositionInRoomSecondary = (address: string, room: Room): number => {
        let result = -1
        if (room != null) {
            result = room.players.findIndex(player =>
                player.socketUser.user.address === address)
        }
        return result
    }


export const getRoomFromCode = (code: string, roomSet: RoomSet): Room | null => {
        let result: Room | null = null
        const resultWithUndefined: Room | undefined = roomSet.find(room => room.code === code)
        if (typeof resultWithUndefined != 'undefined') {
            result = resultWithUndefined
        }
        return result
    }


export const getNumberOfPlayers = (code: string, roomSet: RoomSet): number => {
    const room: Room | null = getRoomFromCode(code, roomSet)
    let result = -1
    if (room != null) {
        result = room.players.length
    }
    return result
}