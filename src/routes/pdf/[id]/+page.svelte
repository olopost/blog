<script lang="ts">
    export let data;
    import "@/lib/prism/prism"
    import {goto} from "$app/navigation"
    import {pb} from "$lib/pocketbase";
    import jsPDF from "jspdf";
    export function goHome() {
        console.log("GoHome!!!");
        goto('/');
    }
    export function PDF() {
        var doc = new jsPDF();
        console.log(data.updated)
        const udt = new Date(data.updated)
        let source = document.querySelector("#article")
        doc.html(source, {callback: function(doc) {doc.save(data.title + "-" + udt.toISOString() + ".pdf")}, x:15, y:15, width: 170, windowWidth: 650});
    }
</script>
<header class="bg-white">
<span class="isolate inline-flex rounded-md shadow-sm">
<button type="button" class="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10" on:click={goHome}>Retour</button>
<button type="button" class="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10" on:click={PDF}>PDF</button>
    <button type="button" class="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"></button>

</span>
</header>
{#if pb.authStore.token}
{#key data}

    <article id="article" class="prose w-a4 h-a4">
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