<script lang="ts">
    import {onMount, beforeUpdate} from 'svelte';
    import { currentUser, pb } from './pocketbase';
    export let currentPage = 1;

    export let totalPage = 0;
    let req;
    export let billets = [];

    if (currentPage == null) {
        currentPage = 1;
    }

    onMount(async () => {
        req = (await pb.collection('kb_note').getList(currentPage, 4, {sort:"-created", filter:"published=true"}));
        billets = req.items;
        totalPage = req.totalPages;
    });
</script>

{#each billets as billet}
        <article class="prose prose-stone prose-sm text-justify max-w-2xl">
            {@html billet.note}
        </article>
    <space/>
{/each}
<space/>
{#each {length: totalPage} as _, i}
    <a target="_self" href="#/{i+1}">{i+1}&nbsp;</a>
{/each}


