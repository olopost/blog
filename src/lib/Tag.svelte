<script lang="ts">
    import {pb, tags} from "./pocketbase";
    import type {Record} from "pocketbase";
    export let note :Record;
    export let item_tags = [];
    export let ltags = [];

    ltags = tags;
    function feedItem() {
        if (item_tags.length === 0) {
            if (note) {
                note.tag.forEach(e => {
                    item_tags.push(e)
                })
            }
        }
        console.log("Item feeded: "  + item_tags)
        ltags = ltags;
    }
    async function getLabel(id) {
        console.log("getLabel(" + id + ")")
        let tagclass :string;
        let d :string;
        let ret :string;

        await note;
        await tags.forEach(e => {
            if (e.id == id) {
                ret = e.label;
            }
        })
        if (item_tags.includes(id)) {
            tagclass = "inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10";
            d = "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        } else {
            tagclass = "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-blue-700/10"
            d = "M9 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 9 4z"
        }
        return {"item": ret, "class": tagclass, "d": d}
    }

async function cleartag(value) {
        console.log(item_tags + "  ->  " + value);
        if (item_tags.includes(value))   {
            item_tags = item_tags.filter(item_tags => item_tags != value)
        } else {
            item_tags.push(value)
        }
    console.log(item_tags);
    const data = {
        "tag": item_tags
    }
    await pb.collection("kb_note").update(note.id, data);
    ltags = ltags;
}
    $: note && feedItem();
    $: ltags;
</script>
{#await note}
    Affichage des tags...
{:then result}
    {#each ltags as tag}
        {#await getLabel(tag.id)}
            ...
        {:then label}
    <span class={label.class}>
    {label.item}
        <button on:click={cleartag(tag.id)}  type="button" class="inline-flex items-center p-0.5 ml-2 text-sm text-gray-400 bg-transparent rounded-sm hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-gray-300" data-dismiss-target="#badge-dismiss-dark" aria-label="Remove">
      <svg aria-hidden="true" class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d={label.d} clip-rule="evenodd"></path></svg>
      <span class="sr-only">Remove badge</span>
  </button>
    </span>
        {:catch error}
            {error}
        {/await}
    {/each}
{:catch e}
    {e}
{/await}
