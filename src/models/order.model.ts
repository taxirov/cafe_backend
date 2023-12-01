export type OrderCreateModel = {
    title: string
    desc: string
    room_id: number | null
    user_id: number
}

export type OrderUpdateModel = {
    title: string
    desc: string
    user_id: number
    room_id: number | null
}