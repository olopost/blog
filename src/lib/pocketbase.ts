import PocketBase from 'pocketbase';
import conf from "./../assets/pb.json"
import { writable } from 'svelte/store';
import {push} from "svelte-spa-router";

export const pb = new PocketBase(conf.url);

export const currentUser = writable(pb.authStore.model);

export const tags = await pb.collection("kb_tags").getFullList();

pb.authStore.onChange((auth) => {
    console.log('authStore changed', auth);
    currentUser.set(pb.authStore.model);
});

export async function oidcAuth() {
    await pb.collection('users').authWithOAuth2({provider: "oidc"});
    push("/login")
}
export function oidcLogout() {
    pb.authStore.clear()
    push("/logout")
}
export function getAvatar() {
    // console.log("getAvatar:")
    let ret :string
    ret = conf.url + "/api/files/users/" + pb.authStore.model.id + "/" + pb.authStore.model.avatar;
    console.log(ret)
    return ret;
}
