// DOM Elementleri
const root = document.documentElement;
const themeBtn = document.getElementById('tema');
const menu = document.getElementById('menu');
const hamburger = document.getElementById('hamburger');
const currentYearSpan = document.getElementById('yil');
const navLinks = document.querySelectorAll('.nav-links a');

// --- SVG İkon Tanımlamaları ---
const icons = {
    sun: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
    moon: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
    menu: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`,
    close: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
};

// --- Tema Yönetimi ---
const applyTheme = (theme) => {
    root.dataset.tema = theme;
    themeBtn.innerHTML = theme === 'dark' ? icons.sun : icons.moon;
    themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç');
};

// Başlangıç temasını uygula
applyTheme(root.dataset.tema || 'light');

themeBtn.addEventListener('click', () => {
    const newTheme = root.dataset.tema === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    try { localStorage.setItem('tema', newTheme); } catch (e) { console.warn("Local storage erişilemiyor."); }
});

// --- Mobil Menü Yönetimi ---
const toggleMenu = (isOpen) => {
    menu.classList.toggle('acik', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'Menüyü kapat' : 'Menüyü aç');
    hamburger.innerHTML = isOpen ? icons.close : icons.menu;
};

hamburger.addEventListener('click', () => {
    const isCurrentlyOpen = menu.classList.contains('acik');
    toggleMenu(!isCurrentlyOpen);
});

document.addEventListener('click', (e) => {
    if (menu.classList.contains('acik')) {
        const clickedInsideMenu = menu.contains(e.target);
        const clickedHamburger = hamburger.contains(e.target);
        if (!clickedInsideMenu && !clickedHamburger) {
            toggleMenu(false);
        } else if (e.target.closest('a')) {
            toggleMenu(false);
        }
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('acik')) toggleMenu(false);
});

// --- ScrollSpy (Kaydırırken aktif linki bulma) ---
const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                const targetId = link.getAttribute('href').substring(1);
                if (targetId === entry.target.id) {
                    link.setAttribute('aria-current', 'true');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        }
    });
}, observerOptions);

document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));

// --- Footer Yılı ---
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

/* =========================================
   SCROLL (KAYDIRMA) ANİMASYONLARI
   ========================================= */
const scrollElements = document.querySelectorAll('.animate-on-scroll');

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add('is-visible');
            scrollObserver.unobserve(el);
            // Animasyon bitince sınıfı ve gecikmeyi temizle ki hover efektleri normal çalışsın
            const gecikme = parseFloat(el.style.transitionDelay) || 0;
            setTimeout(() => {
                el.classList.remove('animate-on-scroll', 'is-visible');
                el.style.transitionDelay = '';
            }, gecikme + 800);
            }
    });
}, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
});

scrollElements.forEach(el => scrollObserver.observe(el));


/* =========================================
   DİNAMİK YAZI (TYPEWRITER) EFEKTİ
   ========================================= */
const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = ["Yazılım Geliştiriciyim.", "Açık Kaynak Tutkunuyum.", "Problem Çözücüyüm.", "Full-Stack Coder'ım."];
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if(!typedTextSpan) return;
    if (charIndex < textArray[textArrayIndex].length) {
        if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        cursorSpan.classList.remove("typing");
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if(!typedTextSpan) return;
    if (charIndex > 0) {
        if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        cursorSpan.classList.remove("typing");
        textArrayIndex++;
        if(textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const azHareket = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (azHareket || !typedTextSpan || !cursorSpan || !textArray.length) return;
    typedTextSpan.textContent = '';
    setTimeout(type, 1000);
});

/* =========================================
   PREMIUM KART IŞILTISI (SPOTLIGHT EFFECT)
   ========================================= */
// Sayfadaki tüm spotlight özellikli kartları seç
const cards = document.querySelectorAll(".card-spotlight");

// Fare kartların üzerinde gezindiğinde X ve Y koordinatlarını CSS'e aktar
cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        // Farenin kart içindeki konumunu hesapla
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Hesaplanan değerleri CSS değişkenlerine yaz
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    });
});