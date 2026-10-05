import { getSearchEntries } from "@/lib/mdx";

export const dynamic = "force-static";

export async function GET() {
  return Response.json(await getSearchEntries());
}
