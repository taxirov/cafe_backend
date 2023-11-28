export type OrderCreateModel = {
    title: string
    desc: string
    user_id: number
    room_id: number | null
    created_date: string
}

export type OrderUpdateModel = {
    title: string
    desc: string
    user_id: number
    room_id: number | null
}