<script lang="ts">
    import {onMount, beforeUpdate} from 'svelte';
    import { currentUser, pb } from './pocketbase';

    let now = new Date();
    export let year = now.getFullYear();
    let billets = [];
    onMount(async () => {
        let req;
        req = (await pb.collection('kb_mentionlegale').getList(1, 1, {sort:"-created"}));
        billets = req.items;
    });
    let tgml_state = false;
    function tgml() {
        if (tgml_state == true) {
            tgml_state = false;
        } else {
            tgml_state = true;
        }
    };
</script>

{#each billets as billet}
    <button on:click={tgml} id="ml-button" data-toggle="collapse" data-target="#mention">&copy;2021-{ year }&nbspSamuel MEYNARD</button>
    {#if tgml_state}
    <div id="mention">
        {@html billet.text}
    </div>
        {/if}
{/each}
