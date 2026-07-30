'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function SliderInitializer() {
  const pathname = usePathname();

  useEffect(() => {
    const initializedSliders = new Set<HTMLElement>();

    const initializeSliders = () => {
      const sliders = document.querySelectorAll('div[data-image-slider="true"]');
      
      sliders.forEach((sliderEl) => {
        const slider = sliderEl as HTMLElement;
        if (initializedSliders.has(slider)) return;
        initializedSliders.add(slider);

        // 1. Wrap the slider in a static relative positioning wrapper if not already wrapped
        let wrapper = slider.parentElement;
        if (!wrapper || !wrapper.classList.contains('slider-wrapper')) {
          wrapper = document.createElement('div');
          wrapper.className = 'slider-wrapper';
          wrapper.style.position = 'relative';
          wrapper.style.width = '100%';
          wrapper.style.margin = '32px 0';
          
          slider.parentNode?.insertBefore(wrapper, slider);
          wrapper.appendChild(slider);
        }

        // Apply premium styling and visual layout resets to the scrolling flex container
        slider.style.display = 'flex';
        slider.style.overflowX = 'auto';
        slider.style.gap = '20px';
        slider.style.padding = '24px 40px';
        slider.style.margin = '0'; // Margin is now on the outer wrapper
        slider.style.scrollSnapType = 'x mandatory';
        slider.style.scrollBehavior = 'smooth';
        slider.style.background = 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)';
        slider.style.borderRadius = '24px';
        slider.style.alignItems = 'center';
        slider.style.boxShadow = 'inset 0 2px 8px rgba(0, 0, 0, 0.02), 0 4px 20px -2px rgba(0, 0, 0, 0.04)';
        slider.style.scrollbarWidth = 'none'; // Hide scrollbar for clean layout
        
        // Style all image slide items
        const images = slider.querySelectorAll('img');
        images.forEach((img) => {
          const imgEl = img as HTMLImageElement;
          imgEl.style.height = '320px';
          imgEl.style.minWidth = '280px';
          imgEl.style.maxWidth = '85%';
          imgEl.style.borderRadius = '16px';
          imgEl.style.scrollSnapAlign = 'center';
          imgEl.style.objectFit = 'cover';
          imgEl.style.flexShrink = '0';
          imgEl.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease, filter 0.4s ease, box-shadow 0.4s ease';
          imgEl.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.08)';
        });

        // 2. Setup Premium Next/Prev floating overlay buttons (attached to the static outer wrapper)
        const btnPrev = document.createElement('button');
        const btnNext = document.createElement('button');
        
        const btnCommonStyle = (btn: HTMLButtonElement, isLeft: boolean) => {
          btn.style.position = 'absolute';
          btn.style.top = '50%';
          btn.style.transform = 'translateY(-50%)';
          btn.style.left = isLeft ? '16px' : 'auto';
          btn.style.right = isLeft ? 'auto' : '16px';
          btn.style.width = '42px';
          btn.style.height = '42px';
          btn.style.borderRadius = '50%';
          btn.style.background = 'rgba(255, 255, 255, 0.95)';
          btn.style.border = '1px solid rgba(226, 232, 240, 0.8)';
          btn.style.boxShadow = '0 4px 14px rgba(15, 23, 42, 0.1)';
          btn.style.display = 'flex';
          btn.style.alignItems = 'center';
          btn.style.justifyContent = 'center';
          btn.style.cursor = 'pointer';
          btn.style.pointerEvents = 'auto';
          btn.style.opacity = '0';
          btn.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
          btn.style.zIndex = '20';
          btn.innerHTML = isLeft 
            ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';
          
          btn.addEventListener('mouseenter', () => {
            btn.style.background = '#1d4ed8';
            btn.style.borderColor = '#1d4ed8';
            const svg = btn.querySelector('svg');
            if (svg) svg.setAttribute('stroke', '#ffffff');
            btn.style.transform = 'translateY(-50%) scale(1.1)';
          });
          btn.addEventListener('mouseleave', () => {
            btn.style.background = 'rgba(255, 255, 255, 0.95)';
            btn.style.borderColor = 'rgba(226, 232, 240, 0.8)';
            const svg = btn.querySelector('svg');
            if (svg) svg.setAttribute('stroke', '#0f172a');
            btn.style.transform = 'translateY(-50%) scale(1)';
          });
        };

        btnCommonStyle(btnPrev, true);
        btnCommonStyle(btnNext, false);

        wrapper.appendChild(btnPrev);
        wrapper.appendChild(btnNext);

        // Hover listeners on the wrapper to fade in/out nav buttons
        wrapper.addEventListener('mouseenter', () => {
          btnPrev.style.opacity = '1';
          btnNext.style.opacity = '1';
        });
        wrapper.addEventListener('mouseleave', () => {
          btnPrev.style.opacity = '0';
          btnNext.style.opacity = '0';
        });

        // Navigation click events
        btnPrev.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const firstImg = slider.querySelector('img');
          const itemWidth = firstImg ? firstImg.clientWidth + 20 : 300;
          slider.scrollBy({ left: -itemWidth, behavior: 'smooth' });
        });

        btnNext.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const firstImg = slider.querySelector('img');
          const itemWidth = firstImg ? firstImg.clientWidth + 20 : 300;
          slider.scrollBy({ left: itemWidth, behavior: 'smooth' });
        });

        // 3. Center Auto-Zoom & Scroll Blurring logic
        const centerZoom = () => {
          const isCenterZoomEnabled = slider.getAttribute('data-center-zoom') !== 'false';
          if (!isCenterZoomEnabled) return;

          const sliderRect = slider.getBoundingClientRect();
          const sliderCenterX = sliderRect.left + sliderRect.width / 2;

          images.forEach((img) => {
            const imgRect = img.getBoundingClientRect();
            const imgCenterX = imgRect.left + imgRect.width / 2;
            const distance = Math.abs(sliderCenterX - imgCenterX);
            const maxDistance = sliderRect.width / 2;

            // Normalize distance ratio (0 in absolute center, 1 at edge limits)
            const ratio = Math.min(distance / maxDistance, 1);

            // Dynamically scale image size and transparency based on distance
            const scale = 1.05 - ratio * 0.13;
            const opacity = 1.0 - ratio * 0.35;
            const blur = ratio * 1.5;

            const imgEl = img as HTMLImageElement;
            imgEl.style.transform = `scale(${scale})`;
            imgEl.style.opacity = `${opacity}`;
            imgEl.style.filter = blur > 0.2 ? `blur(${blur}px)` : 'none';
          });
        };

        // Scroll listener for zoom effect
        slider.addEventListener('scroll', centerZoom, { passive: true });
        setTimeout(centerZoom, 100);

        // 4. Auto-Scroll logic
        let autoScrollInterval: NodeJS.Timeout | null = null;
        let isHovered = false;

        const startAutoScroll = () => {
          const isAutoScrollEnabled = slider.getAttribute('data-auto-scroll') !== 'false';
          if (!isAutoScrollEnabled) return;

          const speedAttr = slider.getAttribute('data-speed');
          const speed = parseInt(speedAttr || '3000') || 3000;

          if (autoScrollInterval) clearInterval(autoScrollInterval);
          autoScrollInterval = setInterval(() => {
            if (isHovered) return;

            const maxScroll = slider.scrollWidth - slider.clientWidth;
            if (slider.scrollLeft >= maxScroll - 10) {
              slider.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
              const firstImg = slider.querySelector('img');
              const itemWidth = firstImg ? firstImg.clientWidth + 20 : 300;
              slider.scrollBy({ left: itemWidth, behavior: 'smooth' });
            }
          }, speed);
        };

        const stopAutoScroll = () => {
          if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
          }
        };

        wrapper.addEventListener('mouseenter', () => {
          isHovered = true;
          stopAutoScroll();
        });
        wrapper.addEventListener('mouseleave', () => {
          isHovered = false;
          startAutoScroll();
        });

        startAutoScroll();

        // Attach cleanups
        (slider as any)._sliderCleanup = () => {
          stopAutoScroll();
          slider.removeEventListener('scroll', centerZoom);
        };
      });
    };

    // Run initially
    initializeSliders();

    // Setup mutation observer to initialize new sliders in TipTap editor instantly
    const observer = new MutationObserver(() => {
      initializeSliders();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      initializedSliders.forEach((slider) => {
        if ((slider as any)._sliderCleanup) {
          (slider as any)._sliderCleanup();
        }
      });
    };
  }, [pathname]);

  return null;
}
