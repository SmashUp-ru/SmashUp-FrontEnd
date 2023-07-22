export default async function apiHandler(url, { body, method, headers }) {
    const res = await fetch('https://api.smashup.ru' + url, {
        method,
        mode: "cors",
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(body)
    })

    return res
}