import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

export async function POST(req: NextRequest) {
    if (!process.env.ENCRYPTION_KEY) {
        return NextResponse.json({ error: "Key not found" }, { status: 400 })
    }
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'base64');

    const body = await req.json() as { value: string[][] }

    const encryptData = body.value.map(each => each.map( text => {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
        const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
        const tag = cipher.getAuthTag();
        return Buffer.concat([iv, tag, encrypted]).toString('base64')
    }))

    return NextResponse.json({ encrypted: encryptData }, { status: 200 });
}