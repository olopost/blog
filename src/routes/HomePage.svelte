<script lang="ts">
    import BilletList from "../lib/BilletList.svelte";
    import Footer from "../lib/Footer.svelte"
    export let params = {};

</script>

<main>
    <div class="max-w-xl m-auto flex-rows-2 grid grid-cols-4">
        <div class="col-span-1">
            <a href="https://www.meyn.fr" target="_blank" rel="noreferrer">
                <img src="/portrait.png" class="h-12 w-12 flex-none rounded-full" alt="SME Logo" />
            </a>
        </div>
        <div class="col-span-3 ">
            <h1>Samuel MEYNARD</h1>
            <h2>Architecte Sécurité des systèmes d'information</h2>
        </div>
    </div>
    <space/>
    <div class="grid grid-cols-1">
            <BilletList currentPage="{params.page}"/>
    </div>
</main>

<footer>
    <Footer />
</footer>