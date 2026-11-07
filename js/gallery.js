$(function () {
  const $items = $('.gallery-item');
  const $lightbox = $('#lightbox');
  const $img = $('#lightbox-img');
  const $title = $('#lightbox-title');
  const $counter = $('#lightbox-counter');
  const total = $items.length;
  const FADE = 300;
  const SWAP = 200;
  let current = 0;
  let busy = false;

  function dataFor(index) {
    const $it = $items.eq(index);
    return {
      src: $it.find('img').attr('src'),
      alt: $it.find('img').attr('alt'),
      title: $it.find('figcaption').text()
    };
  }

  function render(index) {
    const d = dataFor(index);
    $img.attr({ src: d.src, alt: d.alt });
    $title.text(d.title);
    $counter.text((index + 1) + ' / ' + total);
  }

  function open(index) {
    current = index;
    render(current);
    $img.css('opacity', 1);
    $('body').css('overflow', 'hidden');
    $lightbox.stop(true, true).fadeIn(FADE);
    $lightbox.find('.lightbox-close').trigger('focus');
  }

  function close() {
    $lightbox.stop(true, true).fadeOut(FADE, function () {
      $('body').css('overflow', '');
      $items.eq(current).trigger('focus');
    });
  }

  function go(step) {
    if (busy) return;
    busy = true;
    current = (current + step + total) % total;
    const d = dataFor(current);

    $img.stop(true).animate({ opacity: 0 }, SWAP, function () {
      $img.off('load.lb').one('load.lb', function () {
        $title.text(d.title);
        $counter.text((current + 1) + ' / ' + total);
        $img.animate({ opacity: 1 }, SWAP, function () { busy = false; });
      });
      $img.attr({ src: d.src, alt: d.alt });
    });
  }

  $items.on('click', function () { open($items.index(this)); });
  $items.on('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open($items.index(this));
    }
  });

  $('.lightbox-prev').on('click', function (e) { e.stopPropagation(); go(-1); });
  $('.lightbox-next').on('click', function (e) { e.stopPropagation(); go(1); });
  $('.lightbox-close').on('click', close);

  $('.lightbox-inner').on('click', function (e) {
    if (e.target === this) close();
  });

  $(document).on('keydown', function (e) {
    if (!$lightbox.is(':visible')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') go(-1);
    else if (e.key === 'ArrowRight') go(1);
  });

  let startX = null;
  $lightbox.on('touchstart', function (e) { startX = e.originalEvent.touches[0].clientX; });
  $lightbox.on('touchend', function (e) {
    if (startX === null) return;
    const dx = e.originalEvent.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    startX = null;
  });
});