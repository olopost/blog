<script lang="ts">
  import Router from "svelte-spa-router";
  import HomePage from "./routes/HomePage.svelte";
  import NotFound from "./routes/NotFound.svelte";
  import editPage from "./routes/editPage.svelte";
 import subPage from "./routes/subPage.svelte";
  const routes = {
      "/": HomePage,
      "/login": HomePage,
      "/logout": HomePage,
      "/page/:tag/:page": HomePage,
      "/edit/:pageId": editPage,
      "/subPage/:editor": subPage,
      "*": NotFound
  }
</script>
<main>
    <Router {routes}/>
</main>