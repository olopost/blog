<script lang="ts">

    import {tags} from "./pocketbase";
    export let article_tags = [];
    import plus from "../assets/plus.xml?raw"
    import cross from "../assets/x-mark.xml?raw"

    export let labelIn = "inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10";
    export let labelOut = "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-blue-700/10"

    export let Article = []
    function updateArticle() {
        Article = []
        tags.forEach(e => {
            if (article_tags.includes(e.id)) {
                let ret = {
                    "name": e.label,
                    "id": e.id,
                    "label": labelIn
                }
                Article.push(ret)
            } else {
                let ret = {
                    "name": e.label,
                    "id": e.id,
                    "label": labelOut
                }
                Article.push(ret)
            }
        })
    }
    updateArticle()

    function toggleTag(id) {
        if (article_tags.includes(id)) {
            article_tags = article_tags.filter(article_tags => article_tags != id)
        } else {
            article_tags.push(id)
        }
        updateArticle()
        Article = Article
        article_tags = article_tags
}
    $: Article
</script>
<div>
    {#each Article as tag}
    <span class={tag.label}>
    {tag.name}
        <button on:click={toggleTag(tag.id)} type="button" class="{tag.label}"
                data-dismiss-target="#badge-dismiss-dark" aria-label="Remove">
      {@html cross}
            <span class="sr-only">Remove badge</span>
  </button>
    </span>
    {/each}
</div>