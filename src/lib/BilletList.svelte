<script lang="ts">
    import {onMount} from 'svelte';
    import {location, push} from 'svelte-spa-router';
    import { currentUser, pb } from './pocketbase';
    export let currentPage = 1;
    export let currentTag = null;
    export let totalPage = 0;
    export let billets = [];

    if (currentPage == null) {
        currentPage = 1;
    }
    if (currentTag == "all") {
        currentTag = null;
    }

    /**
     * Display the list of billets (by page of `maxBillet`)
     * @param pb
     * @param currentTag
     *
     * If user authentified then display also billet not public
     * If no tag or tag = all --> display all billets
     * if tag present --> display only tagged billets
     *
     * the function return a promise with the list of billet
     * total page that can be requested
     */
    async function calculateBillets(pb: any, currentTag: string) {
        let req;
        let maxBillet = 4;
        let billets;
        let totalPage;
        // -------------
        let filter = "published=true";
        if (pb.authStore.isValid) {
            filter = ""
            console.log("authenticated:" + filter)
        }
        // ---
        if (currentTag == null) {
            req = (await pb.collection('kb_note').getList(currentPage, maxBillet, {sort:"-created", filter:filter}));
            billets = req.items;
            totalPage = req.totalPages;
        } else {
            if (filter) {
                console.log("not authenticated" + filter)
                filter = "tag.id=\'" + currentTag +"\'" +  "&&" + filter;
            } else {
                filter = "tag.id=\'" + currentTag +"\'";
            }
            req = (await pb.collection('kb_note').getList(currentPage, maxBillet, {sort:"-created", filter:filter,expand: "tag.id"}));
            billets = req.items;
            totalPage = req.totalPages;
        }
        return {billets: billets, totalPage: totalPage}
    }
    onMount(async () => {
        let req = (await calculateBillets(pb, currentTag))
        totalPage = req.totalPage;
        billets = req.billets;
    });
    $: async() => {
        let req = (await calculateBillets(pb, currentTag));
        totalPage = req.totalPage;
        billets = req.billets;
    }
    $: {billets = [...billets]
    totalPage = totalPage;
    }
    function editPage(id) {
        push("/edit/" + id);
    }
    function prose(billet) {
        if (billet.published) {
            return "prose prose-stone prose-sm text-justify max-w-2xl"
        } else {
            return "prose prose-stone prose-sm text-justify max-w-2xl bg-slate-200"
        }
    }
</script>
{#each billets as billet}
        <article class="{prose(billet)}">
            {@html billet.note}
            {#if pb.authStore.isValid}
            <button on:click={editPage(billet.id)}>Edit</button>
            {/if}
        </article>
    <space/>
{/each}
<space/>
{#each {length: totalPage} as _, i}
    <a target="_self" href="#/page/all/{i+1}">{i+1}&nbsp;</a>
{/each}


