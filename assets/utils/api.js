export default async function apiHandler(url, { body, method }) {
    const res = await fetch('https://api.smashup.ru' + url, {
        method,
        mode: "cors",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })

    return res
}