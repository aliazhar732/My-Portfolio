/* ================================================================
   YOUR NAME — Front-End Developer Portfolio
   script.js  —  Built with jQuery
   ================================================================ */

(function ($) {
  'use strict';

  /* ================================================================
     1. Navbar — scrolled state + mobile toggle + active link
     ================================================================ */
  $(window).on('scroll', function () {
    var scrollPos = $(window).scrollTop();

    // Add 'scrolled' class for background blur
    $('#mainNav').toggleClass('scrolled', scrollPos > 50);

    // Back-to-top visibility
    $('#backToTop').toggleClass('show', scrollPos > 400);

    // Active nav link based on scroll position
    $('section[id], header[id]').each(function () {
      var sectionTop = $(this).offset().top - 100;
      var sectionBottom = sectionTop + $(this).outerHeight();
      var sectionId = $(this).attr('id');

      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        $('.nav-link').removeClass('active');
        $('.nav-link[href="#' + sectionId + '"]').addClass('active');
      }
    });
  });

  // Mobile hamburger toggle
  $('#navToggle').on('click', function () {
    var $this = $(this);
    var $menu = $('#navMenu');

    $this.toggleClass('open');
    $menu.slideToggle(300);

    // Toggle Bootstrap collapse state manually
    $menu.toggleClass('show');
  });

  // Close mobile menu when a link is clicked
  $('#navMenu .nav-link').on('click', function () {
    if ($(window).width() < 992) {
      $('#navToggle').removeClass('open');
      $('#navMenu').slideUp(300).removeClass('show');
    }
  });

  /* ================================================================
     2. Smooth scrolling for anchor links
     ================================================================ */
  $('a[href^="#"]').on('click', function (e) {
    var target = $(this).attr('href');

    if (target === '#' || target.length < 2) return;

    var $target = $(target);

    if ($target.length) {
      e.preventDefault();
      $('html, body').animate(
        {
          scrollTop: $target.offset().top - 60,
        },
        600
      );
    }
  });

  /* ================================================================
     3. Scroll reveal animations (IntersectionObserver)
     ================================================================ */
  function initReveal() {
    var $elements = $('.reveal');

    if (!('IntersectionObserver' in window)) {
      $elements.addClass('visible');
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var $el = $(entry.target);
            var delay = $el.data('delay') || 0;

            setTimeout(function () {
              $el.addClass('visible');

              // Animate skill bars when visible
              if ($el.hasClass('skill-card')) {
                $el.find('.skill-fill').each(function () {
                  var level = $(this).data('level');
                  $(this).css('width', level + '%');
                });
              }

              // Animate counters when visible
              if ($el.hasClass('stat-card')) {
                $el.find('.counter').each(function () {
                  animateCounter($(this));
                });
              }
            }, delay);

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    $elements.each(function () {
      observer.observe(this);
    });
  }

  /* ================================================================
     4. Counter animation
     ================================================================ */
  function animateCounter($el) {
    var target = parseInt($el.data('target'), 10);
    var duration = 1800;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      $el.text(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        $el.text(target);
      }
    }

    requestAnimationFrame(step);
  }

  /* ================================================================
     5. Typing animation in hero
     ================================================================ */
  function initTyping() {
    var phrases = [
      'I build responsive websites.',
      'I create clean user interfaces.',
      'I love modern web development.',
      'I turn ideas into real projects.',
    ];

    var $typed = $('#typed');
    if (!$typed.length) return;

    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typingSpeed = 80;
    var deletingSpeed = 40;
    var pauseEnd = 1800;
    var pauseStart = 500;

    function type() {
      var currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        $typed.text(currentPhrase.substring(0, charIndex - 1));
        charIndex--;
      } else {
        $typed.text(currentPhrase.substring(0, charIndex + 1));
        charIndex++;
      }

      var delay = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && charIndex === currentPhrase.length) {
        delay = pauseEnd;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = pauseStart;
      }

      setTimeout(type, delay);
    }

    type();
  }

  /* ================================================================
     6. Project filtering
     ================================================================ */
  function initProjectFilter() {
    $('.filter-btn').on('click', function () {
      var $btn = $(this);
      var filter = $btn.data('filter');

      // Update active button
      $('.filter-btn').removeClass('active');
      $btn.addClass('active');

      // Filter projects
      $('.project-item').each(function () {
        var $item = $(this);
        var categories = $item.data('category').split(' ');

        if (filter === 'all' || categories.indexOf(filter) !== -1) {
          $item.removeClass('hide');
          // Re-trigger reveal
          setTimeout(function () {
            $item.css('opacity', '1').css('transform', 'scale(1)');
          }, 50);
        } else {
          $item.addClass('hide');
        }
      });
    });
  }

  /* ================================================================
     7. Contact form validation + submission
     ================================================================ */
  function validateField($field, type) {
    var value = $field.val().trim();
    var $error = $('#' + $field.attr('id') + 'Error');
    var isValid = true;
    var errorMsg = '';

    if (!value) {
      errorMsg = 'This field is required.';
      isValid = false;
    } else if (type === 'name' && value.length < 2) {
      errorMsg = 'Please enter a valid name.';
      isValid = false;
    } else if (type === 'email') {
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMsg = 'Please enter a valid email address.';
        isValid = false;
      }
    } else if (type === 'subject' && value.length < 3) {
      errorMsg = 'Subject must be at least 3 characters.';
      isValid = false;
    } else if (type === 'message' && value.length < 10) {
      errorMsg = 'Message must be at least 10 characters.';
      isValid = false;
    }

    if (isValid) {
      $field.removeClass('invalid');
      $error.text('');
    } else {
      $field.addClass('invalid');
      $error.text(errorMsg);
    }

    return isValid;
  }

  function initContactForm() {
    var $form = $('#contactForm');
    if (!$form.length) return;

    // Live validation on blur
    $('#name').on('blur', function () {
      validateField($(this), 'name');
    });
    $('#email').on('blur', function () {
      validateField($(this), 'email');
    });
    $('#subject').on('blur', function () {
      validateField($(this), 'subject');
    });
    $('#message').on('blur', function () {
      validateField($(this), 'message');
    });

    // Clear invalid state on input
    $form.on('input', '.invalid', function () {
      $(this).removeClass('invalid');
      $('#' + $(this).attr('id') + 'Error').text('');
    });

    $form.on('submit', function (e) {
      e.preventDefault();

      var isValid =
        validateField($('#name'), 'name') &&
        validateField($('#email'), 'email') &&
        validateField($('#subject'), 'subject') &&
        validateField($('#message'), 'message');

      if (!isValid) return;

      var $btn = $('#submitBtn');
      var originalHtml = $btn.html();
      $btn.html('<i class="fa-solid fa-spinner fa-spin"></i> Sending...').prop('disabled', true);

      var formData = {
        name: $('#name').val().trim(),
        email: $('#email').val().trim(),
        subject: $('#subject').val().trim(),
        message: $('#message').val().trim(),
      };

      // Try submitting to PHP backend (contact.php)
      // Falls back to simulated success if PHP is not available
      $.ajax({
        url: '/php/contact.php',
        type: 'POST',
        data: formData,
        dataType: 'json',
        timeout: 8000,
      })
        .done(function (response) {
          if (response && response.success) {
            showFormSuccess();
          } else {
            showFormError();
          }
        })
        .fail(function () {
          // PHP backend not available (e.g. running on Vite dev server)
          // Simulate successful submission for demo purposes
          setTimeout(function () {
            showFormSuccess();
          }, 500);
        })
        .always(function () {
          $btn.html(originalHtml).prop('disabled', false);
        });
    });
  }

  function showFormSuccess() {
    $('#formSuccess').addClass('show');
    $('#formError').removeClass('show');
    $('#contactForm')[0].reset();

    setTimeout(function () {
      $('#formSuccess').removeClass('show');
    }, 5000);
  }

  function showFormError() {
    $('#formError').addClass('show');
    $('#formSuccess').removeClass('show');

    setTimeout(function () {
      $('#formError').removeClass('show');
    }, 5000);
  }



  /* ================================================================
     9. Initialize everything on DOM ready
     ================================================================ */
  $(function () {
    initReveal();
    initTyping();
    initProjectFilter();
    initContactForm();
    initDownloadCV();

    // Trigger initial scroll handler
    $(window).trigger('scroll');
  });
})(jQuery);
