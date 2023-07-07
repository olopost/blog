<script lang="ts">
    import {onMount} from 'svelte';
    import {location, push} from 'svelte-spa-router';
    import { currentUser, pb } from './pocketbase';

    import Header from "./Header.svelte";
    export let currentPage = 1;

    export let search = null;
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
    async function calculateBillets(pb: any, currentTag: string, search: string) {
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
        if (search) {
            filter = "note~\'" +  search + "\'";
            console.log(filter)
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
        let req = (await calculateBillets(pb, currentTag, search))
        totalPage = req.totalPage;
        billets = req.billets;
    });

    /**
     * On change, we reload the page and recalculate billet
     */
    $: async() => {
        let req = (await calculateBillets(pb, currentTag, search));
        totalPage = req.totalPage;
        billets = req.billets;
    }
    $: {billets = [...billets]
    totalPage = totalPage;
        search = search;
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
        let page_url = 'https://www.meyn.fr/#/pdf/'.concat(id)
        console.log(page_url)
        let data = new FormData();
        let headers = new Headers();
        headers.append("Access-Control-Allow-Origin", "*")
        headers.append("Accept", "application/pdf")
        data.append("url", page_url)
        data.append("extraHttpHeaders", JSON.stringify({"Authorization": pb.authStore.token}))
        let response
        try {
            response = await fetch(pdf_url, {
                method: "POST",
                headers: headers,
                mode: "cors",
                body: data
            })
        } catch(e) {
            console.error(e)
        } finally {
            const blob = await response.blob();
            console.log(blob.size)
            let anchor = document.createElement("a")
            const file = window.URL.createObjectURL(blob);
            anchor.href = file
            anchor.download = "".concat(id + ".pdf")
            anchor.click()
        }

            //.then(res => res.blob()).then(blob => {var file = window.URL.createObjectURL(blob);
        //window.location.assign(file);
        //});
    }
</script>
{#key search}
{#if search}
<h1> Terme de la recherche : {search}</h1>
{/if}
    {/key}
{#each billets as billet}
        <article class="{prose(billet)}">
            <div class="flex justify-between">
                <h1 class="justify-start">{billet.title}</h1>
                {#if pb.authStore.isValid}
                    <div>
                        <button class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 ring-1 ring-inset ring-blue-500/10" on:click={editPage(billet.id)}>Edit</button>
                        <button class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 ring-1 ring-inset ring-blue-500/10" on:click={pdfPage(billet.id)}>Pdf</button>
                        <button class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 ring-1 ring-inset ring-blue-500/10" on:click={pdfGenerate(billet.id)}>PdfGen</button>
                    </div>
                {/if}
            </div>
                {#if billet.diag}
                    <h2>Le diagramme</h2>
                        <img class="block max-w-full" src="{billet.diag}"/>
                    {/if}
                <div class="grow"></div>
            {#if billet.diag}
                <h2>Le contenu</h2>
            {/if}
            {@html billet.note}
        </article>
    <space/>
{/each}
<space/>
{#each {length: totalPage} as _, i}
    <a target="_self" href="#/page/all/{i+1}">{i+1}&nbsp;</a>
{/each}


