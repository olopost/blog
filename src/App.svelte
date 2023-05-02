<script lang="ts">
  import Router from "svelte-spa-router";
  import HomePage from "./routes/HomePage.svelte";
  import NotFound from "./routes/NotFound.svelte";
  let routes = {
      "/": HomePage,
      "/:page": HomePage,
      "*": NotFound
  }
</script>
<nav>
    <a href="#/">Home</a>
</nav>
<main>
    <Router {routes}/>
</main>