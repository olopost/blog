import {pb} from "$lib/pocketbase"
import {browser} from "$app/environment"

export const load = async ({params}) => {
    if (browser) {
        let note = (await pb.collection("kb_note").getOne(params.id, {expand: "tag.label"}))
        return {
            id: params.id,
            title: note.title,
            body: note.note,
            diag: note.diag,
            checked: note.published,
            tags: note.tag
        }
    }
}