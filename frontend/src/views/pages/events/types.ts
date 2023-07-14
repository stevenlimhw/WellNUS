// Event = { id, owner_id, event_name, event_description, start_time, end_time, access, category }

export type Event = {
    id: number,
    owner_id: number,
    event_name: string,
    event_description: string,
    start_time: Date,
    end_time: Date,
    access: string,
    category: string
}