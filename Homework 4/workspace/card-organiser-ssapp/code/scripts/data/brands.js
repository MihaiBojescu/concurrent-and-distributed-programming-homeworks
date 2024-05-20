export const brands = [
    {
        "name": "Unknown",
        "value": "unknown",
        "image": "assets/images/question.svg"
    },

export const brandsByValue = brands.reduce((acc, entry) => {
    acc[entry.value] = entry
    return acc
}, {})

export const brandsByTitle = brands.reduce((acc, entry) => {
    acc[entry.name] = entry
    return acc
}, {})
