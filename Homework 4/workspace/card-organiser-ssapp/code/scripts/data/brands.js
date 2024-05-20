export const brands = [
    {
        "name": "Auchan",
        "value": "auchan",
        "image": "assets/images/auchan.svg"
    },
    {
        "name": "Brico Depot",
        "value": "brico",
        "image": "assets/images/brico.svg"
    },
    {
        "name": "Carrefour",
        "value": "carrefour",
        "image": "assets/images/carrefour.svg"
    },
    {
        "name": "Drogerie Market",
        "value": "dm",
        "image": "assets/images/dm.svg"
    },
    {
        "name": "Dr. Max",
        "value": "drmax",
        "image": "assets/images/drmax.svg"
    },
    {
        "name": "H & M",
        "value": "hm",
        "image": "assets/images/hm.svg"
    },
    {
        "name": "Kaufland",
        "value": "kaufland",
        "image": "assets/images/kaufland.svg"
    },
    {
        "name": "Lidl",
        "value": "lidl",
        "image": "assets/images/lidl.svg"
    },
    {
        "name": "Mega Image",
        "value": "mega",
        "image": "assets/images/mega.svg"
    },
    {
        "name": "Metro",
        "value": "metro",
        "image": "assets/images/metro.svg"
    },
    {
        "name": "Penny",
        "value": "penny",
        "image": "assets/images/penny.svg"
    },
    {
        "name": "Selgros",
        "value": "selgros",
        "image": "assets/images/selgros.svg"
    },
    {
        "name": "Unknown",
        "value": "unknown",
        "image": "assets/images/question.svg"
    },
]

export const brandsByValue = brands.reduce((acc, entry) => {
    acc[entry.value] = entry
    return acc
}, {})

export const brandsByTitle = brands.reduce((acc, entry) => {
    acc[entry.name] = entry
    return acc
}, {})
