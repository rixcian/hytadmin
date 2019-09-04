export default async function initWebp() {
  if (!window.createImageBitmap) return false;

  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  const blob = await fetch(webpData).then(r => r.blob());
  return createImageBitmap(blob).then(
    () => document.querySelector('html').classList.add('webp'),
    () => document.querySelector('html').classList.add('no-webp')
  );
}