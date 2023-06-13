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
</script>

<NavBar />

{#if data.error}
<Alert level="error" message="{data.error}" title="{data.title}"/>
{/if}
{#if data.info}
    <Alert level="info" message="{data.info}" title="{data.title}"/>
{/if}

<main>
    <Header/>
    {#key currentPage}
        {#key currentTag}
    <div class="grid grid-cols-1">
            <BilletList bind:currentTag bind:currentPage></BilletList>
    </div>
    {/key}
        {/key}
    {#if pb.authStore.isValid}
    {/if}
</main>

<footer>
    <Footer />
</footer>
