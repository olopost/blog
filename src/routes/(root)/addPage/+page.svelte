<script lang="ts">
    import {pb} from "$lib/pocketbase";
    import NavBar from "$lib/NavBar.svelte";
    import AddForm from "$lib/AddForm.svelte";
</script>

<NavBar/>
<main>
    <article class="grid grid-cols-1 prose">
        <AddForm/>
    </article>
</main>
