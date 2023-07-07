<script>
import NavBar from "../lib/NavBar.svelte";
import {onMount} from "svelte";
import {pb} from "../lib/pocketbase.ts";

export let params = {};
export let billets = [];

function prose(billet) {
    if (billet.published) {
        return "prose prose-stone prose-sm text-justify max-w-2xl"
    } else {
        return "prose prose-stone prose-sm text-justify max-w-2xl bg-slate-200"
    }
}

onMount(async () => {
    let filter = "note~\'" +  params.search + "\'";
    let req = (await pb.collection('kb_note').getList(1, 10, {sort:"-created", filter:filter}));
    billets = req.items;
});

async function calculateSearch(mysearch) {
    let filter = "note~\'" +  params.search + "\'";
    let req = (await pb.collection('kb_note').getList(1, 10, {$autoCancel:false, sort:"-created", filter:filter}));
    billets =  req.items
}

$: if (params.search) {
    calculateSearch(params.search)
}
$: billets

</script>
<NavBar/>

<h1> Résultat de la recherche : {params.search}</h1>
{#key billets}
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
{/each}
    {/key}
