const shortcutUrl =
  "https://www.icloud.com/shortcuts/7e0f61d7edc448d7949397dc133d2883";

export function GET() {
  return Response.redirect(shortcutUrl, 302);
}
