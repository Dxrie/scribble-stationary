import {NextRequest, NextResponse} from "next/server";

export function middleware(req: NextRequest) {
    const apiKey = req.headers.get('x-api-key');

    if (apiKey !== process.env.NEXT_PUBLIC_API_SECRET_KEY) {
        return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }

    return NextResponse.next();
}

// Apply middleware only to API routes
export const config = {
    matcher: '/api/:path*',
};
