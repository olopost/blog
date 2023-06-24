<script lang="ts">
    import BilletList from "$lib/BilletList.svelte";
    import Footer from "$lib/Footer.svelte";
    import NavBar from "$lib/NavBar.svelte";
    import Alert from "$lib/Alert.svelte"
    import {onMount} from "svelte";

    import { currentUser, pb, oidcLogout, oidcAuth} from '$lib/pocketbase';
    import Header from "$lib/Header.svelte";
    import {invalidate, invalidateAll} from "$app/navigation";
    export let data;
    export let params = {};
    export let currentTag;
    export let currentPage;
    export let search;

    async function cleanUp() {
        let item = document.querySelector('div.ql-toolbar');
        if (item) {
            item.remove();
        } else {
        }
    }
    onMount(async () => {
        console.log('cleanUp')
        await cleanUp();
    });

    $: currentTag = data.currentTag
    $: search = data.search
</script>

<NavBar />

{#if data.error}
<Alert level="error" message="{data.error}" title="{data.title}"/>
{/if}
{#if data.info}
    <Alert level="info" message="{data.info}" title="{data.title}"/>
{/if}

<main id="main">
    <Header/>
    <div id="socle">
    {#key currentPage}
        {#key currentTag}
            {#key search}
    <div class="grid grid-cols-1">
        {#if search}
            <h3>Recherche de {search}</h3>
            {/if}
            <BilletList bind:search bind:currentTag bind:currentPage></BilletList>
    </div>
                {/key}
    {/key}
        {/key}
    {#if pb.authStore.isValid}
    {/if}
    </div>
</main>

<footer>
    <Footer />
</footer>
