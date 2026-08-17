/**
 * blog-cards — a horizontal carousel of blog preview cards.
 * Each authored card is two cells:
 *   [ picture ] [ category, title, excerpt, author, read-time ]
 * @param {Element} block
 */
export default function init(block) {
  [...block.children].forEach((card) => {
    card.classList.add('blog-card');
    const [media, body] = [...card.children];
    if (media) media.classList.add('blog-card-media');
    if (!body) return;
    body.classList.add('blog-card-body');
    const ps = [...body.children];
    const roles = [
      'blog-card-cat',
      'blog-card-title',
      'blog-card-excerpt',
      'blog-card-author',
      'blog-card-readtime',
    ];
    ps.forEach((p, i) => { if (roles[i]) p.classList.add(roles[i]); });
    const author = ps[3];
    const readtime = ps[4];
    if (author && readtime) {
      const foot = document.createElement('div');
      foot.className = 'blog-card-foot';
      foot.append(author, readtime);
      body.append(foot);
    }
  });

  // horizontal-scroll indicator (scrollbar-style thumb) rendered under the rail
  const indicator = document.createElement('div');
  indicator.className = 'blog-cards-scroll';
  indicator.setAttribute('aria-hidden', 'true');
  const thumb = document.createElement('span');
  thumb.className = 'blog-cards-scroll-thumb';
  indicator.append(thumb);
  block.after(indicator);

  const update = () => {
    const track = block.scrollWidth - block.clientWidth;
    if (track <= 1) {
      indicator.style.display = 'none';
      return;
    }
    indicator.style.display = '';
    const ratio = block.clientWidth / block.scrollWidth;
    const progress = block.scrollLeft / track;
    thumb.style.width = `${ratio * 100}%`;
    thumb.style.left = `${progress * (100 - ratio * 100)}%`;
  };

  let ticking = false;
  block.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
}
