<script lang="ts">
    import {onMount} from "svelte";
    import {oidcAuth, pb} from "../lib/pocketbase";

    export let params;
    export let content;
    export let src = null;
    export let title = null;

    onMount(async () => {
        const note = (await pb.collection("kb_note").getOne(params.pageId, {expand: "tag.label"}))
        title = note.title
        content = note.note
        src = note.diag
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

    <article class="prose w-a4 h-14">
        <h1>{title}</h1>
        {#if src}
            <h2>Le diagramme</h2>
            <img class="block max-w-full" src="{src}"/>
            <h2>Le contenu</h2>
        {/if}
        {@html content}
    </article>