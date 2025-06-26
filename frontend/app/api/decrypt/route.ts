import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const ALGORITHM = 'aes-256-gcm';

export async function POST(req: NextRequest) {
    if (!process.env.ENCRYPTION_KEY) {
        return NextResponse.json({ error: "Key not found" }, { status: 400 })
    }
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'base64');

    const body = await req.json() as { value: string[][] }

    const decryptedData = body.value.map(each => each.map(item => {
        let data: Buffer<ArrayBuffer>
        if (item == undefined) {
            return undefined
        } else if (typeof item === 'string') {
            data = Buffer.from(item, 'base64');
        } else if (Buffer.isBuffer(item)) {
            // item is already a Buffer
            data = item;
        } else {
            throw new Error('Invalid data type for decryption');
        }
        const iv = data.subarray(0, 12);
        const tag = data.subarray(12, 28);
        const encrypted = data.subarray(28);

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(tag);

        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return decrypted.toString('utf8');
    }))

    return NextResponse.json({ decrypted: decryptedData }, { status: 200 });
}