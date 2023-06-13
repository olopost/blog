import {browser} from "$app/environment"
export const load = e => {
    if (browser) {
        const currentTag = e.url.searchParams.get('currentTag')
        const currentPage = e.url.searchParams.get('currentPage')
        const info = e.url.searchParams.get('info')
        const error = e.url.searchParams.get('error')
        const title = e.url.searchParams.get('title')
        return {
            'currentTag': currentTag,
            'currentPage': currentPage,
            'info': info,
            'error': error,
            'title': title,
        }
    }
}