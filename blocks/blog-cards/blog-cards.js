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
}
