export async function POST() {
  return Response.json(
    { error: "Online payments are unavailable." },
    { status: 410 },
  );
}
