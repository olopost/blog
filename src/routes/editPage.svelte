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
    let conf = {
        branding: false,
        promotion: false,
        menubar: false,
        min_height: 270,
        height: 270,
        max_height: 700,
        autoresize_bottom_margin: 30,
        content_style: "body { font-size: 14px }",
        plugins: [
            "autoresize",
            "autolink",
            "lists",
            "link",
            "image",
            "searchreplace",
            "fullscreen",
            "media",
            "table",
            "code",
            "codesample",
        ],
        toolbar:
            "undo redo | styles | alignleft aligncenter alignright | bold italic forecolor backcolor | bullist numlist | link image table codesample | code fullscreen",
    };
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
<button class="rounded-md bg-indigo-600 text-white px-3 hover:bg-indigo-500 shadow-sm focus-visible:outline-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 " on:click={changeClick}>Save</button>
<Toggle bind:checked={checked} on:click={toggleId}/>
