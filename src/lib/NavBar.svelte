<script lang="ts">
    import {push} from "svelte-spa-router";
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

    function route(id) {
        console.log(id)

        push("/page/" + id + "/1");
    }

    export function search(evt) {
        if (evt.key == "Enter") {
            let item = document.getElementById("search").value;
            push("/search/" + item)
        }
    }
</script>
<nav>

    <span class="isolate inline-flex rounded-md shadow-sm">
       <button type="button" class="relative px-3 py-2 text-gray-900 hover:bg-gray-50 focus:z-10"
               on:click={() => push("/")}>Home</button>
        <!-- Search button -->
          <div>
  <div class="relative mt-2 flex items-center">
    <input on:keypress={search} type="text" name="search" id="search"
           class="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
    <div class="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
      <kbd class="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400">⌘K</kbd>
    </div>
  </div>
</div>
        <!-- end search button -->
        {#each tags as tag}
            <button type="button" class="relative px-3 py-2 text-gray-900 hover:bg-gray-50 focus:z-10"
                    on:click={route(tag.id)}>{tag.label}</button>&nbsp;
        {/each}
        {#if pb.authStore.isValid}
        <button type="button" class="relative px-3 py-2 text-gray-900 hover:bg-gray-50 focus-z-10"
                on:click={oidcLogout}>{@html logout}</button>
        <button type="button" class="relative px-3 py-2 text-gray-900 hover:bg-gray-50 focus-z-10"
                on:click={addPageRoute}>{@html adddoc}</button>
        <button type="button" class="relative px-3 py-2 text-gray-900 hover:bg-gray-50 focus-z-10" disabled>
            <img class="inline-block h-8 w-8 rounded-full" src="{getAvatar()}" alt="">
            {$currentUser.username}
        </button>
            {:else }
        <button type="button" class="relative px-3 py-2 text-gray-900 hover:bg-gray-50 focus-z-10"
                on:click={oidcAuth}>{@html login}</button>
        {/if}
    </span>
</nav>
