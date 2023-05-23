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
        let mybillets;
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
            mybillets = req.items;
            totalPage = req.totalPages;
        } else {
            if (filter) {
                console.log("not authenticated" + filter)
                filter = "tag.id=\'" + currentTag +"\'" +  "&&" + filter;
            } else {
                filter = "tag.id=\'" + currentTag +"\'";
            }
            req = (await pb.collection('kb_note').getList(currentPage, maxBillet, {sort:"-created", filter:filter,expand: "tag.id"}));
            mybillets = req.items;
            totalPage = req.totalPages;
        }
        return {billets: mybillets, totalPage: totalPage}
    }

    /**
     * We calculate billet at page initial loading
     */
    onMount(async () => {
        let req = (await calculateBillets(pb, currentTag))
        totalPage = req.totalPage;
        billets = req.billets;
    });

    /**
     * On change, we reload the page and recalculate billet
     */
    $: async() => {
        let req = (await calculateBillets(pb, currentTag));
        totalPage = req.totalPage;
        billets = req.billets;
    }
    $: {billets = [...billets]
    totalPage = totalPage;
    }

    /**
     * Routing function
     * @param id
     */
    function editPage(id) {
        push("/edit/" + id);
    }
    function pdfPage(id) {
        push("/pdf/" + id);
    }
    function prose(billet) {
        if (billet.published) {
            return "prose prose-stone prose-sm text-justify max-w-2xl"
        } else {
            return "prose prose-stone prose-sm text-justify max-w-2xl bg-slate-200"
        }
    }

    /**
     * PDF button generation
     * @param id
     */
    async function pdfGenerate(id) {
        let pdf_url = 'https://pdf.meyn.fr/forms/chromium/convert/url'
        let page_url = 'https://www.meyn.fr/#/pdf/' + id
        let data = new FormData();
        data.append("url", page_url)
        data.append("extraHttpHeaders", JSON.stringify({"Authorization": pb.authStore.token}))
        fetch(pdf_url, {
            method: "POST",
            mode: "no-cors",
            body: data
        }).then(res => res.blob()).then(blob => {var file = window.URL.createObjectURL(blob);
        window.location.assign(file);
        });
    }
</script>
{#each billets as billet}
        <article class="{prose(billet)}">
            <div class="flex">
                <h1>{billet.title}</h1>
                <div class="grow"></div>
                {#if pb.authStore.isValid}
                <button class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 ring-1 ring-inset ring-blue-500/10" on:click={editPage(billet.id)}>Edit</button>
                <button class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 ring-1 ring-inset ring-blue-500/10" on:click={pdfPage(billet.id)}>Pdf</button>
                    <button class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 ring-1 ring-inset ring-blue-500/10" on:click={pdfGenerate(billet.id)}>PdfGen</button>
                {/if}
            </div>
            {@html billet.note}
        </article>
    <space/>
{/each}
<space/>
{#each {length: totalPage} as _, i}
    <a target="_self" href="#/page/all/{i+1}">{i+1}&nbsp;</a>
{/each}


