import PocketBase from 'pocketbase';
import conf from './../assets/pb.json'
import { writable } from 'svelte/store';
import {invalidate, goto, invalidateAll} from "$app/navigation";

export const pb = new PocketBase(conf.url);

export const currentUser = writable(pb.authStore.model);

export const tags = await pb.collection("kb_tags").getFullList();

pb.authStore.onChange((auth) => {
    console.log('authStore changed', auth);
    currentUser.set(pb.authStore.model);
});

export async function oidcAuth() {
    await pb.collection('users').authWithOAuth2({provider: "oidc"});
location.reload()
}
export function oidcLogout() {
    pb.authStore.clear()
    location.reload()
}
export function getAvatar() {
    // console.log("getAvatar:")
    let ret :string
    ret = conf.url + "/api/files/users/" + pb.authStore.model.id + "/" + pb.authStore.model.avatar;
    console.log(ret)
    return ret;
}
