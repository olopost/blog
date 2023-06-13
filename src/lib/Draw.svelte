<script lang="ts">
    import { writable, get } from 'svelte/store';
    import {pb} from "./pocketbase";
    import type {Record} from "pocketbase";
    import initimg from "../assets/initimage.txt?raw"
    export let noteid;
    export let lnote :Record;
    import {createImgObserver} from "./imgChange";

    const onsrc = createImgObserver(() => {
        updateB64()
    })
    async function updateB64() {

        console.log("image going to be save" + new Date())
        let limg = document.getElementById("img")
        if (limg) {
            localStorage.setItem('b64', limg.src)
            const data = {
                "diag": limg.src
            }
            pb.collection("kb_note").update(noteid, data)
        } else {
            localStorage.setItem('b64', initimg)
        }
        console.log("image updated")
    }
    function initB64() {
        document.addEventListener('dblclick', function (evt) {
            var url = 'https://embed.diagrams.net/?embed=1&ui=atlas&spin=1&modified=unsavedChanges&proto=json';
            var source = evt.srcElement || evt.target;

            if (source.nodeName == 'IMG' && source.className == 'drawio') {
                if (source.drawIoWindow == null || source.drawIoWindow.closed) {
                    // Implements protocol for loading and exporting with embedded XML
                    var receive = function (evt) {
                        if (evt.data.length > 0 && evt.source == source.drawIoWindow) {
                            var msg = JSON.parse(evt.data);

                            // Received if the editor is ready
                            if (msg.event == 'init') {
                                // Sends the data URI with embedded XML to editor
                                source.drawIoWindow.postMessage(JSON.stringify(
                                    {action: 'load', xmlpng: source.getAttribute('src')}), '*');
                            }
                            // Received if the user clicks save
                            else if (msg.event == 'save') {
                                // Sends a request to export the diagram as XML with embedded PNG
                                source.drawIoWindow.postMessage(JSON.stringify(
                                    {action: 'export', format: 'xmlpng', spinKey: 'saving'}), '*');
                            }
                            // Received if the export request was processed
                            else if (msg.event == 'export') {
                                // Updates the data URI of the image
                                source.setAttribute('src', msg.data);
                            }

                            // Received if the user clicks exit or after export
                            if (msg.event == 'exit' || msg.event == 'export') {
                                // Closes the editor
                                window.removeEventListener('message', receive);
                                source.drawIoWindow.close();
                                source.drawIoWindow = null;
                            }
                        }
                    };

                    // Opens the editor
                    window.addEventListener('message', receive);
                    source.drawIoWindow = window.open(url);
                } else {
                    // Shows existing editor window
                    source.drawIoWindow.focus();
                }
            }
        });
    }
async function getSrc() {
        lnote = await pb.collection("kb_note").getOne(noteid, {'$autoCancel': false})
        return lnote.diag
}
</script>
{#await getSrc()}
    .... Loading Diagram
    {:then result}
    {#if result}
        <img id="img" use:onsrc on:load={initB64()} class="drawio" style="cursor:default;" src={result}/>
        {:else }
        <img id="img" use:onsrc on:load={initB64()} class="drawio" style="cursor:default;" src={initimg}/>
        {/if}
    {:catch error}
    <p>Get error {error}</p>
    {/await}