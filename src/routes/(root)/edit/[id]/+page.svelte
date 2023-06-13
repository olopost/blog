<script lang="ts">
    import NavBar from "$lib/NavBar.svelte";
    import Toggle from "$lib/Toggle.svelte"
    export let data;
    import blogconf from "@/assets/pb.json"
    import Tag from "$lib/Tag.svelte";
    import {onMount} from "svelte";
    import Draw from "$lib/Draw.svelte";
    import {pb} from "$lib/pocketbase";
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

    onMount(async () => {
    });
    async function changeClick() {
        console.log("save content" + Date())
        const ldata = {
            "note": data.content,
        }
        await pb.collection('kb_note').update(data.id, ldata);
    }
    async function toggleId() {
        data.checked = !data.checked;
        console.log("toggle " + Date() + "- " + data.id + ": (" + data.checked + ")")
        const ldata = {
            "published": data.checked,
        }
        await pb.collection('kb_note').update(data.id,
            ldata,
            {'$autoCancel': false})
    }

    $: note
    $: data
</script>
<NavBar/>

{#await note}
    Chargement de la page ...
{:then result}
    <Editor {conf} bind:value={data.content} on:savecontent={changeClick}  apiKey={blogconf.apiKey}/>
    <Draw noteid={data.id}/>
    <Tag bind:note={data.note}/>
{/await}
<button class="rounded-md bg-indigo-600 text-white px-3 hover:bg-indigo-500 shadow-sm focus-visible:outline-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 " on:click={changeClick}>Save</button>
<Toggle bind:checked={data.checked} on:click={toggleId}/>

