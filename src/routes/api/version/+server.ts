// for getVersion
import {readFileSync} from 'node:fs';
import {fileURLToPath} from "node:url";

function getPackageVersion() {
    const file = fileURLToPath(new URL('../../../../package.json', import.meta.url))
    const json = readFileSync(file, 'utf-8');
    console.log(json)
    let version = JSON.parse(json)
    return version.version
}

export async function GET() {
    return new Response(JSON.stringify({version: getPackageVersion()}), {status: 200})
}
