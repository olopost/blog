<script lang="ts">
    import NavBar from "../lib/NavBar.svelte";
    import Toggle from "../lib/Toggle.svelte"
    import blogconf from "../assets/pb.json"
import Tag from "../lib/Tag.svelte";
    export let params = {}
    import {onMount} from "svelte";
    import {pb} from "../lib/pocketbase";
    import Editor from '@tinymce/tinymce-svelte';
    import type {Record} from "pocketbase";
    export let tags = [];
    export let note :Record;
    export let content = "...";
    let conf = {}
    export let checked = true;

    onMount(async () => {
        note = (await pb.collection("kb_note").getOne(params.pageId, {expand: "tag.label"}))
        content = note.note
        checked = note.published
        tags = note.tag;
    });
    async function changeClick() {
        console.log("save content" + Date())
        const data = {
            "note": content,
        }
        await pb.collection('kb_note').update(params.pageId, data);
    }
    async function toggleId() {
        checked = !checked;
        console.log("toggle " + Date() + "- " + params.pageId + ": (" + checked + ")")
        const data = {
            "published": checked,
        }
        await pb.collection('kb_note').update(params.pageId,
            data,
            {'$autoCancel': false})
    }

    $: note
</script>
<NavBar/>

<Editor {conf} bind:value={content} on:savecontent={changeClick}  apiKey={blogconf.apiKey}/>
{#await note}
    Chargement de la page ...
{:then result}
    <Tag bind:note={note}/>
{/await}
<button on:click={changeClick}>Save</button>
<Toggle bind:checked={checked} on:click={toggleId}/>
