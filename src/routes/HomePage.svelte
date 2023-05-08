<script lang="ts">
    import BilletList from "../lib/BilletList.svelte";
    import Footer from "../lib/Footer.svelte";
    import NavBar from "../lib/NavBar.svelte";
    import {push} from "svelte-spa-router";
    import {onMount} from "svelte";

    import { currentUser, pb } from '../lib/pocketbase';
    export let params = {};

    async function oidcAuth() {
        await pb.collection('users').authWithOAuth2({provider: "oidc"});
        push("/login")
    }
    function oidcLogout() {
        pb.authStore.clear()
        push("/logout")
    }
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
    <div class="max-w-xl m-auto flex-rows-2 grid grid-cols-4">
        <div class="col-span-1">
            <a on:click={oidcAuth} target="_blank" rel="noreferrer">
                <img src="/portrait.png" class="h-12 w-12 flex-none rounded-full" alt="SME Logo" />
            </a>
            {#key currentUser}
            {#if pb.authStore.isValid}
                {pb.authStore.model.username}
                <button on:click={oidcLogout}>logout</button>
                {:else}
                <button on:click={oidcAuth}>&#x21E8;</button>
            {/if}
                {/key}
        </div>
        <div class="col-span-3 ">
            <h1>Samuel MEYNARD</h1>
            <h2>Architecte Sécurité des systèmes d'information</h2>
        </div>
    </div>
    <space/>
    <div class="grid grid-cols-1">
        {#key params}
            <BilletList bind:currentTag="{params.tag}" bind:currentPage="{params.page}"/>
        {/key}
    </div>
</main>

<footer>
    <Footer />
</footer>