<script lang="ts">
    import {pb} from "../lib/pocketbase";
import NavBar from "../lib/NavBar.svelte";
import AddForm from "../lib/AddForm.svelte";
</script>

<NavBar/>
<!--
  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
-->
<main>
    <article class="grid grid-cols-1 prose">
        <AddForm/>
    </article>
</main>
