import { identifyPlant, isAllowedType, MAX_PHOTO_BYTES } from "@/lib/identify";

// Receives a photo from the identify form and asks Claude what plant it shows.
export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const photo = form?.get("photo");
  if (!(photo instanceof File) || photo.size === 0) {
    return Response.json({ ok: false, message: "Please choose a photo first." }, { status: 400 });
  }
  if (!isAllowedType(photo.type)) {
    return Response.json({ ok: false, message: "Please use a JPG, PNG, GIF or WebP photo." }, { status: 400 });
  }
  if (photo.size > MAX_PHOTO_BYTES) {
    return Response.json({ ok: false, message: "That photo is too big. Please use one under 5 MB." }, { status: 400 });
  }
  const data = Buffer.from(await photo.arrayBuffer()).toString("base64");
  return Response.json(await identifyPlant({ data, type: photo.type }));
}
