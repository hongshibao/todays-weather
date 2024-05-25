
export function getCityAndCountryString(item) {
    return `${item.City}${item.Country ? (", " + item.Country) : ""}`
}
