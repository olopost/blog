<script lang="ts">
    import {pb} from "../lib/pocketbase";
import NavBar from "../lib/NavBar.svelte";
</script>

<NavBar/>
<h1>Ajout d'une page</h1>
{pb.authStore.token}