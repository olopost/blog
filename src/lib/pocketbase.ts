import PocketBase from 'pocketbase';
import conf from './../assets/pb.json'
import { writable } from 'svelte/store';

console.log(conf.url    );
export const pb = new PocketBase(conf.url);

export const currentUser = writable(pb.authStore.model);

export const tags = await pb.collection("kb_tags").getFullList();

pb.authStore.onChange((auth) => {
    console.log('authStore changed', auth);
    currentUser.set(pb.authStore.model);
});
