export const createImgObserver = handler => {

    const onload = el => {
        console.log("sme-->add evt")
        let observer = new MutationObserver((changes) => {
            changes.forEach(change => {
                if (change.attributeName.includes('src')){
                    console.log("sme--> src changes")
                    handler()
                }
            })
        })
        observer.observe(el, {attributes: true})
    }

    return onload
}
