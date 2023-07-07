<script lang="ts">
    import {onMount} from "svelte";
    import {oidcAuth, pb} from "../lib/pocketbase";
    import {push} from "svelte-spa-router";
    import {doc_jspdf} from "../lib/pdf";

    export let params;
    export let content;
    export let updated;
    export let src = null;
    export let title = null;

   export function goHome() {
        push("/");
    }
    export function PDF() {
        console.log(updated)
        const udt = new Date(updated)
        let source = document.querySelector("#article")
        doc_jspdf.html(source, {callback: function(doc) {doc.save(title + "-" + udt.toISOString() + ".pdf")}, x:15, y:15, width: 170, windowWidth: 650});
    }
    onMount(async () => {
        const note = (await pb.collection("kb_note").getOne(params.pageId, {expand: "tag.label"}))
        title = note.title
        content = note.note
        src = note.diag
        updated = note.updated
    });
    $: content
</script>
<style>
    article {
        border: none;
        overflow: visible;
        width: 210mm;
        max-width: 210mm;
    }
    @media print {
        @page {
            size: 210mm 297mm;
            margin: 0;
        }
    }
</style>
<header class="bg-white">
<span class="isolate inline-flex rounded-md shadow-sm">
<button type="button" class="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10" on:click={goHome}>Retour</button>
<button type="button" class="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10" on:click={PDF}>PDF</button>
    <button type="button" class="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"></button>

</span>
</header>
    <article id="article" class="prose w-a4 h-14">
        <h1>{title}</h1>
        {#if src}
            <h2>Le diagramme</h2>
            <img class="block max-w-full" src="{src}"/>
            <h2>Le contenu</h2>
        {/if}
        {@html content}
    </article>