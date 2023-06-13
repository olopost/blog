<script lang="ts">
    export let data;
    import {goto} from "$app/navigation"
    import {pb} from "$lib/pocketbase";
    export function goHome() {
        console.log("GoHome!!!");
        goto('/');
    }
    pb.authStore.token =
</script>
{#if pb.authStore.token}
{#key data}
    <article class="prose w-a4 h-a4">
        <h1 on:click={goHome}>{data.title}</h1>
        {#if data.diag}
            <h2>Le diagramme</h2>
            <img class="block max-w-full" src="{data.diag}"/>
            <h2 class="text-black-400">Le contenu</h2>
        {/if}
        {@html data.body}
    </article>
{/key}
    {:else }
    Authentification nécessaire
{/if}