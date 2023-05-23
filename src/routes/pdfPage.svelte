<script lang="ts">
    import {onMount} from "svelte";
    import {pb} from "../lib/pocketbase";

    export let params;
    export let content;

    onMount(async () => {
        let note
        note = (await pb.collection("kb_note").getOne(params.pageId, {expand: "tag.label"}))
        content = note.note
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

{#if pb.authStore.isValid}
    <article class="prose w-a4 h-14">
        {@html content}
    </article>
    {:else}
    <h1>Authentification requise</h1>
{/if}