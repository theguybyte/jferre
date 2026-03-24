import { createWriteStream, mkdirSync } from 'fs';
import { pipeline } from 'stream/promises';
import path from 'path';

const PUBLIC = new URL('../public/', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

const images = [
  // Instructor / testimonial avatars (200x200 face)
  { url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face', dest: 'images/instructors/photo-1472099645785-5658abf4ff4e.jpg' },
  { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', dest: 'images/instructors/photo-1534528741775-53994a69daeb.jpg' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', dest: 'images/instructors/photo-1507003211169-0a1dd7228f2d.jpg' },
  { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', dest: 'images/instructors/photo-1494790108377-be9c29b29330.jpg' },
  { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', dest: 'images/instructors/photo-1500648767791-00dcc994a43e.jpg' },
  { url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', dest: 'images/instructors/photo-1438761681033-6461ffad8d80.jpg' },
  { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face', dest: 'images/instructors/photo-1544005313-94ddf0286df2.jpg' },
  { url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face', dest: 'images/instructors/photo-1506794778202-cad84cf45f1d.jpg' },
  { url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face', dest: 'images/instructors/photo-1531746020798-e6953c6e8e04.jpg' },
  { url: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=face', dest: 'images/instructors/photo-1519345182560-3f2917c472ef.jpg' },
  { url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face', dest: 'images/instructors/photo-1517841905240-472988babdf9.jpg' },
  { url: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&h=200&fit=crop&crop=face', dest: 'images/instructors/photo-1507591064344-4c6ce005b128.jpg' },

  // Course thumbnails (800x450)
  { url: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=450&fit=crop', dest: 'images/courses/photo-1579468118864-1b9ea3c0db4a.jpg' },
  { url: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=800&h=450&fit=crop', dest: 'images/courses/photo-1621839673705-6617adf9e890.jpg' },
  { url: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=450&fit=crop', dest: 'images/courses/photo-1618401471353-b98afee0b2eb.jpg' },
  { url: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=450&fit=crop', dest: 'images/courses/photo-1526379095098-d400fd0bf935.jpg' },
  { url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop', dest: 'images/courses/photo-1633356122544-f134324a6cee.jpg' },
  { url: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=450&fit=crop', dest: 'images/courses/photo-1627398242454-45a1465c2479.jpg' },
  { url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=450&fit=crop', dest: 'images/courses/photo-1544383835-bda2bc66a55d.jpg' },
  { url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=450&fit=crop', dest: 'images/courses/photo-1516116216624-53e697fedbea.jpg' },
  { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop', dest: 'images/courses/photo-1451187580459-43490279c0fa.jpg' },
  { url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop', dest: 'images/courses/photo-1555949963-aa79dcee981c.jpg' },
  { url: 'https://images.unsplash.com/photo-1667372393119-c8f473882e8e?w=800&h=450&fit=crop', dest: 'images/courses/photo-1667372393119-c8f473882e8e.jpg' },
  { url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=450&fit=crop', dest: 'images/courses/photo-1512941937669-90a1b58e7e9c.jpg' },

  // Page images
  { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop', dest: 'images/photo-1522071820081-009f0129c71c.jpg' },
  { url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop', dest: 'images/photo-1524178232363-1fb2b075b655.jpg' },
  { url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop', dest: 'images/photo-1600880292203-757bb62b4baf.jpg' },
  { url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop', dest: 'images/photo-1552664730-d307ca884978.jpg' },
  { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop', dest: 'images/photo-1516321318423-f06f85e504b3.jpg' },

  // Payment logo
  { url: 'https://www.mercadopago.com/org-img/Manual/ManualMP/imgs/isologoVertical.png', dest: 'images/mercadopago-logo.png' },
];

async function download(url, dest) {
  const fullPath = path.join(PUBLIC, dest);
  mkdirSync(path.dirname(fullPath), { recursive: true });
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DECLASES-downloader/1.0)' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  await pipeline(res.body, createWriteStream(fullPath));
  console.log(`✓ ${dest}`);
}

console.log(`Downloading ${images.length} images...\n`);
const results = await Promise.allSettled(images.map(({ url, dest }) => download(url, dest)));

let failed = 0;
results.forEach((r, i) => {
  if (r.status === 'rejected') {
    console.error(`✗ ${images[i].dest}: ${r.reason.message}`);
    failed++;
  }
});

console.log(`\nDone: ${images.length - failed} succeeded, ${failed} failed.`);
