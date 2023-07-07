<script lang="ts">
  import Router from "svelte-spa-router";
  import HomePage from "./routes/HomePage.svelte";
  import NotFound from "./routes/NotFound.svelte";
  import editPage from "./routes/editPage.svelte";
 import subPage from "./routes/subPage.svelte";
 import addPage from "./routes/addPage.svelte";
  import pdfPage from "./routes/pdfPage.svelte";
  import searchPage from "./routes/searchPage.svelte";

  const routes = {
      "/search/:search": searchPage,
      "/": HomePage,
      "/login": HomePage,
      "/logout": HomePage,
      "/page/:tag/:page": HomePage,
      "/edit/:pageId": editPage,
      "/pdf/:pageId": pdfPage,
      "/subPage/:editor": subPage,
      "/addPage/": addPage,
      "*": NotFound,
  }
</script>
<main>
    <Router {routes}/>
</main>