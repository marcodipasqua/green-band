/**
 * Green Band - Main App Script
 * Interactions, Mobile Nav, Photo Lightbox, Booking Mailer
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.classList.toggle('active', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  // 2. Sticky Navbar scroll effect
  const navbar = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  // 3. Unified Lightbox (Gallery + Band Member Dedicated Sets + Touch Swipe)
  const galleryItems = document.querySelectorAll('.gallery-card');
  const memberCards = document.querySelectorAll('.member-card[data-member]');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  function syncLightboxViewport() {
    const viewport = window.visualViewport;
    if (!lightbox || !viewport || !lightbox.classList.contains('active')) return;

    lightbox.style.width = `${viewport.width}px`;
    lightbox.style.height = `${viewport.height}px`;
    lightbox.style.left = `${viewport.offsetLeft}px`;
    lightbox.style.top = `${viewport.offsetTop}px`;
  }

  window.visualViewport?.addEventListener('resize', syncLightboxViewport);
  window.visualViewport?.addEventListener('scroll', syncLightboxViewport);

  // Dedicated member photo albums (curated live shots per member)
  const membersData = {
    marco: {
      name: 'Marco',
      role: 'Voce & Chitarra',
      photos: [
        {
          src: 'assets/img/members/marco_abbey_crop.jpg',
          caption: 'Marco - Voce & Chitarra'
        },
        {
          src: 'assets/img/members/marco_penza_sky.jpg',
          caption: 'Marco - Voce & Chitarra'
        },
        {
          src: 'assets/img/members/marco_penza_warm.jpg',
          caption: 'Marco - Voce & Chitarra'
        }
      ]
    },
    luca: {
      name: 'Luca',
      role: 'Chitarra',
      photos: [
        {
          src: 'assets/img/members/luca.jpg',
          caption: 'Luca - Chitarra'
        },
        {
          src: 'assets/img/members/luca_abbey_stage.jpg',
          caption: 'Luca - Chitarra'
        }
      ]
    },
    antonio: {
      name: 'Antonio',
      role: 'Basso',
      photos: [
        {
          src: 'assets/img/members/antonio.jpg',
          caption: 'Antonio - Basso'
        },
        {
          src: 'assets/img/members/antonio_penza_crop_clean.jpg',
          caption: 'Antonio - Basso'
        }
      ]
    },
    claudio: {
      name: 'Claudio',
      role: 'Batteria',
      photos: [
        {
          src: 'assets/img/members/claudio.jpg',
          caption: 'Claudio - Batteria'
        },
        {
          src: 'assets/img/members/claudio_alife.jpg',
          caption: 'Claudio - Batteria'
        }
      ]
    }
  };

  // Re-read gallery cards dynamically
  function getGalleryData() {
    const items = document.querySelectorAll('.gallery-card');
    return Array.from(items).map(item => ({
      src: item.getAttribute('data-full-img'),
      caption: item.getAttribute('data-caption') || ''
    }));
  }

  let currentSet = getGalleryData();
  let currentIndex = 0;

  function renderLightbox() {
    if (!lightbox || !currentSet || !currentSet[currentIndex]) return;
    const item = currentSet[currentIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.caption || 'Foto Green Band';

    const counterText = currentSet.length > 1
      ? `<span class="lightbox-counter">${currentIndex + 1} / ${currentSet.length}</span>`
      : '';
    lightboxCaption.innerHTML = `<span>${escapeHtml(item.caption)}</span>${counterText}`;

    // Hide prev/next if only 1 photo
    if (lightboxPrev) lightboxPrev.style.display = currentSet.length > 1 ? 'flex' : 'none';
    if (lightboxNext) lightboxNext.style.display = currentSet.length > 1 ? 'flex' : 'none';
  }

  function openLightboxWithSet(set, index = 0) {
    if (!lightbox || !set || set.length === 0) return;
    currentSet = set;
    currentIndex = Math.max(0, Math.min(index, set.length - 1));
    renderLightbox();
    lightbox.classList.add('active');
    syncLightboxViewport();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function nextLightbox() {
    if (!currentSet || currentSet.length <= 1) return;
    currentIndex = (currentIndex + 1) % currentSet.length;
    renderLightbox();
  }

  function prevLightbox() {
    if (!currentSet || currentSet.length <= 1) return;
    currentIndex = (currentIndex - 1 + currentSet.length) % currentSet.length;
    renderLightbox();
  }

  // Gallery items click
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      openLightboxWithSet(getGalleryData(), index);
    });
  });

  // Member cards click & keyboard access
  memberCards.forEach(card => {
    const memberKey = card.getAttribute('data-member');
    const memberObj = membersData[memberKey];
    if (!memberObj) return;

    function openMember(e) {
      e.preventDefault();
      openLightboxWithSet(memberObj.photos, 0);
    }

    card.addEventListener('click', openMember);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        openMember(e);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightbox);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });

    // Touch Swipe gesture for mobile
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
      if (e.changedTouches.length !== 1) return;
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      if (e.changedTouches.length !== 1) return;
      const diff = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) nextLightbox();
        else prevLightbox();
      }
    }, { passive: true });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
  });

  // 4. Booking & Contact Form - Invio diretto via AJAX (Nessun client aperto)
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const feedback = document.getElementById('form-feedback');

      const name = document.getElementById('contact-name')?.value.trim() || '';
      const email = document.getElementById('contact-email')?.value.trim() || '';
      const venue = document.getElementById('contact-venue')?.value.trim() || '';
      const date = document.getElementById('contact-date')?.value.trim() || '';
      const city = document.getElementById('contact-city')?.value.trim() || '';
      const message = document.getElementById('contact-message')?.value.trim() || '';

      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite;" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10"></path>
          </svg>
          Invio in corso...
        `;
      }

      if (feedback) {
        feedback.innerHTML = '';
      }

      const payload = {
        name: name,
        email: email,
        locale_evento: venue,
        citta: city,
        data_live: date,
        messaggio: message,
        _subject: `Richiesta Live Green Band da ${venue || name} (${city})`,
        _template: 'table'
      };

      try {
        const response = await fetch('https://formsubmit.co/ajax/f26bbeaaba5df9395fcd57b2fb156d5d', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && (data.success === 'true' || data.success === true || response.status === 200)) {
          bookingForm.reset();
          if (feedback) {
            feedback.innerHTML = `
              <div class="feedback-success">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <div>
                  <strong>Richiesta inviata direttamente alla band!</strong>
                  <p>Grazie per averci contattato. Ti risponderemo al più presto all'indirizzo <em>${escapeHtml(email)}</em>.</p>
                </div>
              </div>
            `;
          }
        } else {
          throw new Error(data.message || 'Errore durante l\'invio');
        }
      } catch (err) {
        if (feedback) {
          feedback.innerHTML = `
            <div class="feedback-error">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <div>
                <strong>Invio non riuscito.</strong> Puoi contattarci direttamente via email a: <strong>greenband.greendaytribute@gmail.com</strong>
              </div>
            </div>
          `;
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // 5. Copy Email to Clipboard Button
  const copyEmailBtns = document.querySelectorAll('.btn-copy-email');
  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = 'greenband.greendaytribute@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        const originalText = btn.innerHTML;
        btn.innerHTML = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Email Copiata!
        `;
        btn.classList.add('btn-copied');
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('btn-copied');
        }, 2500);
      } catch (err) {
        window.location.href = `mailto:${email}`;
      }
    });
  });
});
