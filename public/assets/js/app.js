(function () {
   const SCROLL_DELTA = 5;

   const initHoverTabs = () => {
      const hoverDevice = window.matchMedia("(hover: hover) and (pointer: fine)");

      document.addEventListener("pointerover", (event) => {
         if (!hoverDevice.matches || !(event.target instanceof Element)) {
            return;
         }

         const tabTrigger = event.target.closest(
            '#app-header [data-bs-toggle="pill"][data-bs-target]'
         );

         if (!tabTrigger || (event.relatedTarget instanceof Node && tabTrigger.contains(event.relatedTarget))) {
            return;
         }

         window.bootstrap.Tab.getOrCreateInstance(tabTrigger).show();
      });
   };

   const initSmartHeader = () => {
      const appWrapper = document.getElementById("app-wrapper");
      const appHeader = document.getElementById("app-header");

      if (!appWrapper || !appHeader) {
         return;
      }

      let lastScrollTop = appWrapper.scrollTop;
      let isTicking = false;

      const updateHeaderState = () => {
         const currentScrollTop = Math.max(0, appWrapper.scrollTop);
         const headerHeight = appHeader.offsetHeight;
         const scrollDiff = currentScrollTop - lastScrollTop;

         // Kembali ke posisi semula saat berada di area atas (<= tinggi #app-header)
         if (currentScrollTop <= headerHeight) {
            appHeader.classList.remove("header-hidden");
            lastScrollTop = currentScrollTop;
            isTicking = false;
            return;
         }

         // Abaikan gerakan scroll mikro agar header tidak berkedip (flicker)
         if (Math.abs(scrollDiff) < SCROLL_DELTA) {
            isTicking = false;
            return;
         }

         if (scrollDiff > 0) {
            // Scroll ke bawah melewati tinggi header -> slide-up (sembunyi)
            appHeader.classList.add("header-hidden");
         } else {
            // Scroll ke atas -> slide-down (muncul kembali)
            appHeader.classList.remove("header-hidden");
         }

         lastScrollTop = currentScrollTop;
         isTicking = false;
      };

      appWrapper.addEventListener(
         "scroll",
         () => {
            if (!isTicking) {
               window.requestAnimationFrame(updateHeaderState);
               isTicking = true;
            }
         },
         { passive: true }
      );
   };

   if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
         initSmartHeader();
         initHoverTabs();
      });
   } else {
      initSmartHeader();
      initHoverTabs();
   }
})();
