<script lang="ts">
    import {buildUrl} from "$lib/utils";
    import {goto, invalidateAll} from "$app/navigation"
    import {onMount} from "svelte";
    import {addPageRoute} from "./route";
    import {pb, oidcLogout, oidcAuth, currentUser, getAvatar} from "./pocketbase";
    import logout from "../assets/logout.xml?raw"
    import login from "../assets/login.xml?raw"
    import adddoc from "../assets/document-plus.xml?raw"

    export let tags = [];

    onMount(async () => {
        tags = await pb.collection('kb_tags').getFullList({});
    });

    export function filterTag(id) {
        const url = buildUrl('/', {'currentTag': id});
        goto(url, {});
    }
</script>
<nav>

    <span class="isolate inline-flex rounded-md shadow-sm">
       <button type="button" class="relative px-3 py-2 text-gray-900 hover:bg-gray-50 focus:z-10" on:click={() => goto("/")}>Home</button>
    {#each tags as tag}
        <button type="button" class="relative px-3 py-2 text-gray-900 hover:bg-gray-50 focus:z-10" on:click={filterTag(tag.id)}>{tag.label}</button>&nbsp;
    {/each}
        {#if pb.authStore.isValid}
        <button type="button" class="relative px-3 py-2 text-gray-900 hover:bg-gray-50 focus-z-10" on:click={oidcLogout}>{@html logout}</button>
        <button type="button" class="relative px-3 py-2 text-gray-900 hover:bg-gray-50 focus-z-10" on:click={addPageRoute}>{@html adddoc}</button>
        <button type="button" class="relative px-3 py-2 text-gray-900 hover:bg-gray-50 focus-z-10" disabled>
            <img class="inline-block h-8 w-8 rounded-full" src="{getAvatar()}" alt="">
            {$currentUser.username}
        </button>
            {:else }
        <button type="button" class="relative px-3 py-2 text-gray-900 hover:bg-gray-50 focus-z-10" on:click={oidcAuth}>{@html login}</button>
        {/if}
    </span>
</nav>
