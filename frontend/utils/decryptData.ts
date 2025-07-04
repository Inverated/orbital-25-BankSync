export default async function decrypt(items: string[][]) {
    // use list of list to reduce api call 

    const response = await fetch('/api/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: items }),
    });

    try {
        const body = await response.json()
        return body.decrypted
    } catch (err) {
        return new Response('Invalid JSON', { status: 400 })
    }
}
