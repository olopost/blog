export function buildUrl(path, params) {
    const query = { ...params };
    let interpolatedPath = path;
    for (const [param, value] of Object.entries(params)) {
        const replaced = interpolatedPath.replace(`[${param}]`, value);
        if (replaced !== interpolatedPath) {
            interpolatedPath = replaced;
            delete query[param];
        }
    }
    const search = new URLSearchParams(query).toString();
    return `${interpolatedPath}${search ? `?${search}` : ""}`;
}
