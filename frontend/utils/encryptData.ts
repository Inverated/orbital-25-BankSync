export default async function encrypt(items: string[][]) {
    // use list of list to reduce api call 
    const response = await fetch('/api/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: items }),
    });

    const json = await response.json()
    return json.encrypted
}
