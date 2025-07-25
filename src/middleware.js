import { NextResponse } from 'next/server'
import getOrCreateDb from './models/server/dbsetup';
import getOrCreateStorage from './models/server/storage.collection';
 
// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  await Promise.all([
    getOrCreateDb(),
    getOrCreateStorage()
  ]);
  return NextResponse.next();
}
 
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
