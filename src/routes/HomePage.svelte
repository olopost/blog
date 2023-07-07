<script lang="ts">
    import BilletList from "../lib/BilletList.svelte";
    import Footer from "../lib/Footer.svelte";
    import NavBar from "../lib/NavBar.svelte";
    import {onMount} from "svelte";

    import { currentUser, pb, oidcLogout, oidcAuth} from '../lib/pocketbase';
    import Header from "../lib/Header.svelte";
    export let params = {};

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
</script>

<NavBar/>

<main>
    <Header/>
    <div class="grid grid-cols-1">
        {#key params}
            <BilletList bind:search="{params.search}" bind:currentTag="{params.tag}" bind:currentPage="{params.page}"></BilletList>
        {/key}
    </div>
    {#if pb.authStore.isValid}
        {/if}
</main>

<footer>
    <Footer />
</footer>