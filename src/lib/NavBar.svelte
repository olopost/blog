<script lang="ts">
    import {push} from "svelte-spa-router";
    import {onMount} from "svelte";
    import {pb} from "./pocketbase";

    export let tags = [];

    onMount(async () => {
        tags = await pb.collection('kb_tags').getFullList({});
    });
    function route(id) {
        console.log(id)

        push("/page/" + id + "/1");
    }
</script>
<nav>
    <button on:click={() => push("/")}>Home</button>
    {#each tags as tag}
        <button on:click={route(tag.id)}>{tag.label}</button>&nbsp;
    {/each}
</nav>
