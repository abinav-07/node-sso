(function($) {
  let navbarHeight;
  let initialised = false;
  let navbarOffset;

  function elOffset($el) {
    return $el.offset().top - (navbarHeight + navbarOffset);
  }

  function scrollToHash(duringPageLoad) {
    const elScrollToId = location.hash.replace(/^#/, '');
    let $el;

    function doScroll() {
      const offsetTop = elOffset($el);
      window.scrollTo(window.pageXOffset || window.scrollX, offsetTop);
    }

    if (elScrollToId) {
      $el = $(document.getElementById(elScrollToId));

      if (!$el.length) {
        $el = $(document.getElementsByName(elScrollToId));
      }

      if ($el.length) {
        if (duringPageLoad) {
          $(window).one('scroll', function() {
            setTimeout(doScroll, 100);
          });
        } else {
          setTimeout(doScroll, 0);
        }
      }
    }
  }

  function init(opts) {
    if (initialised) {
      return;
    }
    initialised = true;
    navbarHeight = $('.navbar').height();
    navbarOffset = opts.navbarOffset;

    // some browsers move the offset after changing location.
    // also catch external links coming in
    $(window).on("hashchange", scrollToHash.bind(null, false));
    $(scrollToHash.bind(null, true));
  }

  $.catchAnchorLinks = function(options) {
    const opts = $.extend({}, jQuery.fn.toc.defaults, options);
    init(opts);
  };

  $.fn.toc = function(options) {
    const self = this;
    const opts = $.extend({}, jQuery.fn.toc.defaults, options);

    const container = $(opts.container);
    const tocs = [];
    const headings = $(opts.selectors, container);
    let headingOffsets = [];
    const activeClassName = 'active';
    const ANCHOR_PREFIX = "__anchor";
    let maxScrollTo;
    let visibleHeight;
    const headerHeight = 10; // so if the header is readable, its counted as shown
    init();

    const scrollTo = function(e) {
      e.preventDefault();
      let target = $(e.target);
      if (target.prop('tagName').toLowerCase() !== "a") {
        target = target.parent();
      }
      const elScrollToId = target.attr('href').replace(/^#/, '') + ANCHOR_PREFIX;
      const $el = $(document.getElementById(elScrollToId));

      const offsetTop = Math.min(maxScrollTo, elOffset($el));

      $('body,html').animate({ scrollTop: offsetTop }, 400, 'swing', function() {
        location.hash = `#${  elScrollToId}`;
      });

      $('a', self).removeClass(activeClassName);
      target.addClass(activeClassName);
    };

    const calcHadingOffsets = function() {
      maxScrollTo = $("body").height() - $(window).height();
      visibleHeight = $(window).height() - navbarHeight;
      headingOffsets = [];
      headings.each(function(i, heading) {
        const anchorSpan = $(heading).prev("span");
        let top = 0;
        if (anchorSpan.length) {
          top = elOffset(anchorSpan);
        }
        headingOffsets.push(top > 0 ? top : 0);
      });
    }

    //highlight on scroll
    let timeout;
    const highlightOnScroll = function(e) {
      if (!tocs.length) {
        return;
      }
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(function() {
        const top = $(window).scrollTop();
          let highlighted;
        for (let i = headingOffsets.length - 1; i >= 0; i--) {
          const isActive = tocs[i].hasClass(activeClassName);
          // at the end of the page, allow any shown header
          if (isActive && headingOffsets[i] >= maxScrollTo && top >= maxScrollTo) {
            return;
          }
          // if we have got to the first heading or the heading is the first one visible
          if (i === 0 || (headingOffsets[i] + headerHeight >= top && (headingOffsets[i - 1] + headerHeight <= top))) {
            // in the case that a heading takes up more than the visible height e.g. we are showing
            // only the one above, highlight the one above
            if (i > 0 && headingOffsets[i] - visibleHeight >= top) {
              i--;
            }
            $('a', self).removeClass(activeClassName);
            if (i >= 0) {
              highlighted = tocs[i].addClass(activeClassName);
              opts.onHighlight(highlighted);
            }
            break;
          }
        }
      }, 50);
    };
    if (opts.highlightOnScroll) {
      $(window).bind('scroll', highlightOnScroll);
      $(window).bind('load resize', function() {
        calcHadingOffsets();
        highlightOnScroll();
      });
    }

    return this.each(function() {
      //build TOC
      const el = $(this);
      const ul = $('<div class="list-group">');

      headings.each(function(i, heading) {
        const $h = $(heading);

        const anchor = $('<span/>').attr('id', opts.anchorName(i, heading, opts.prefix) + ANCHOR_PREFIX).insertBefore($h);

        const span = $('<span/>')
          .text(opts.headerText(i, heading, $h));

        //build TOC item
        const a = $('<a class="list-group-item"/>')
          .append(span)
          .attr('href', `#${  opts.anchorName(i, heading, opts.prefix)}`)
          .bind('click', function(e) {
            scrollTo(e);
            el.trigger('selected', $(this).attr('href'));
          });

        span.addClass(opts.itemClass(i, heading, $h, opts.prefix));

        tocs.push(a);

        ul.append(a);
      });
      el.html(ul);

      calcHadingOffsets();
    });
};


jQuery.fn.toc.defaults = {
  container: 'body',
  selectors: 'h1,h2,h3',
  smoothScrolling: true,
  prefix: 'toc',
  onHighlight() {},
  highlightOnScroll: true,
  navbarOffset: 0,
  anchorName(i, heading, prefix) {
    return prefix+i;
  },
  headerText(i, heading, $heading) {
    return $heading.text();
  },
  itemClass(i, heading, $heading, prefix) {
    return `${prefix  }-${  $heading[0].tagName.toLowerCase()}`;
  }

};

})(jQuery);
