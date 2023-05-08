<script lang="ts">
    import {pb, tags} from "./pocketbase";
    import type {Record} from "pocketbase";
    export let note :Record;
    export let item_tags = [];
    export let ltags = [];
    import plus from "../assets/plus.xml?raw"
    import cross from "../assets/x-mark.xml?raw"

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
        let svg;
        let ret :string;

        await note;
        await tags.forEach(e => {
            if (e.id == id) {
                ret = e.label;
            }
        })
        if (item_tags.includes(id)) {
            tagclass = "inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10";
            svg = cross;
        } else {
            tagclass = "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-blue-700/10"
            svg = plus;
        }
        return {"item": ret, "class": tagclass, "svg": svg}
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
        <button on:click={cleartag(tag.id)}  type="button" class="{label.tagclass}" data-dismiss-target="#badge-dismiss-dark" aria-label="Remove">
      {@html label.svg}
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
