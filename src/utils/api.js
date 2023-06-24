export default async function apiHandler(url, body) {
    const res = await fetch('https://api.smashup.ru' + url, {
        method: 'POST',
        mode: "cors",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })

    return await res.json()
}