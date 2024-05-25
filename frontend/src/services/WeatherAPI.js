export async function getWeather(city, country) {
    let resp = await fetch(`/api/weather?city=${city}&country=${country}`);
    if (resp.status >= 300) {
        resp = { Error: "Service Unavailable", City: city, Country: country }
    }
    return await resp.json();
}
