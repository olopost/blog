<script lang="ts">
    import Editor from '@tinymce/tinymce-svelte';
    import {buildUrl} from "$lib/utils";
    import {goto} from "$app/navigation";
    import Toggle from "../lib/Toggle.svelte"
    import blogconf from "../assets/pb.json"
    import {pb} from "./pocketbase";
    export let conf = {}
    export let content;
    export let title;
    export let article_tags = []
    import TagCreate from "../lib/TagCreate.svelte";
    import type {Record} from "pocketbase";
    export let checked = false;

    export function changeClick() {

    }
    export function toggleId() {
        checked = !checked;

    }
    async function validate() {
        const data = {
            "note": content,
            "title": title,
            "tag": article_tags,
            "published": checked,
            "privated": true,
        };
        try {
            console.log("--")
            console.log(data)
            let record = await pb.collection('kb_note').create(data, { '$autoCancel': false });
            console.log(record)
        } catch (error) {
            const url = buildUrl('/', {'error': error.originalError,
                                       'title': "Échec de l'action"});
            goto(url)
        } finally {
            const url = buildUrl('/', {'info': "".concat(title, ": créé avec succès"),
                                        'title': "Bravo"});
            goto(url)
        }
    }
    $: article_tags;
</script>
<form on:submit={validate}>
    <div class="space-y-12">
        <div class="border-b border-gray-900/10 pb-12">
            <h2 class="text-base font-semibold leading-7 text-gray-900">Création d'un nouvel article</h2>
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div class="sm:col-span-4">
                    <label for="title" class="block text-sm font-medium leading-6 text-gray-900">Titre</label>
                    <div class="mt-2">
                        <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                            <input bind:value={title} type="text" name="title" id="title" autocomplete="off" class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Votre titre">
                        </div>
                    </div>
                </div>

                <div class="col-span-full">
                    <label for="article" class="block text-sm font-medium leading-6 text-gray-900">Article</label>
                    <div class="mt-2">
                        <Editor {conf} bind:value={content} on:savecontent={changeClick}  apiKey={blogconf.apiKey}/>

                    </div>
                </div>
            </div>
        </div>

        <TagCreate bind:article_tags={article_tags}/>
        <Toggle bind:checked={checked} on:click={toggleId}/>


        <div class="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" class="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
        <button type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
    </div>
</form>
