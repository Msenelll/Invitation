/**
 * PURE PLASTER - INTERACTION & TIMING ENGINE
 * Pure Vanilla ES6 JavaScript | Zero Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // STATE MANAGEMENT & TRANSLATION DICTIONARIES
    // ==========================================================================
    const state = {
        lang: 'tr', // 'tr' or 'en'
        isMusicPlaying: false,
        targetDateString: '2026-06-21T15:00:00+03:00' // ISO 8601 absolute TR time
    };

    const translations = {
        tr: {
            title: "Sinem & Mehmet - Nişan Davetiyesi",
            countdownExpired: "Tören Başladı! ✦",
            localTimeLabel: "Kendi yerel saatinize göre ayarlanmıştır: ",
            timezoneLabel: "Saat Dilimi: ",
            rsvpMailSubject: "Nişan Katılım Bildirimi - ",
            rsvpMailBody: "Merhaba Sinem & Mehmet,%0D%0A%0D%0ANişan töreninize katılacağımı belirtmek isterim.%0D%0A%0D%0ADetaylar:%0D%0AAd Soyad: {name}%0D%0AKatılım Durumu: {status}%0D%0AKişi Sayısı: {guests}%0D%0A%0D%0ASevgilerle!",
            rsvpMailBodyNo: "Merhaba Sinem & Mehmet,%0D%0A%0D%0AMalesef nişan töreninize katılamayacağımı belirtmek isterim. Mutluluklar dilerim!%0D%0A%0D%0ADetaylar:%0D%0AAd Soyad: {name}%0D%0AKatılım Durumu: {status}%0D%0A%0D%0ASevgilerle!"
        },
        en: {
            title: "Sinem & Mehmet - Engagement Invitation",
            countdownExpired: "The Ceremony has Begun! ✦",
            localTimeLabel: "Adjusted automatically to your local time: ",
            timezoneLabel: "Time Zone: ",
            rsvpMailSubject: "Engagement Attendance Notification - ",
            rsvpMailBody: "Hello Sinem & Mehmet,%0D%0A%0D%0AI would like to state that I will attend your engagement ceremony.%0D%0A%0D%0ADetails:%0D%0AName: {name}%0D%0AAttendance Status: {status}%0D%0AGuests: {guests}%0D%0A%0D%0ABest regards!",
            rsvpMailBodyNo: "Hello Sinem & Mehmet,%0D%0A%0D%0AUnfortunately, I cannot attend your engagement ceremony. I wish you all the best!%0D%0A%0D%0ADetaylar:%0D%0AName: {name}%0D%0AAttendance Status: {status}%0D%0A%0D%0ABest regards!"
        }
    };

    // DOM Selectors
    const preloader = document.getElementById('preloader');
    const langBtn = document.getElementById('lang-switch');
    const musicBtn = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    
    // Calendar DOM Elements
    const calTrigger = document.getElementById('btn-calendar-trigger');
    const calMenu = document.getElementById('calendar-menu');
    const calGoogle = document.getElementById('cal-google');
    const calIcal = document.getElementById('cal-ical');
    
    // RSVP DOM Elements
    const rsvpTrigger = document.getElementById('btn-rsvp-trigger');
    const rsvpModal = document.getElementById('rsvp-modal');
    const rsvpClose = document.getElementById('close-rsvp');
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpSuccess = document.getElementById('rsvp-success-msg');
    
    // Timezone & Date Display DOM
    const tzTextNode = document.getElementById('tz-info-text');
    const mainDateNode = document.getElementById('event-date-main');
    const mainTimeNode = document.getElementById('event-time-main');

    // ==========================================================================
    // PRELOADER & INITIALIZATION
    // ==========================================================================
    window.addEventListener('load', () => {
        // Smooth transition out of preloader
        setTimeout(() => {
            preloader.classList.add('fade-out');
        }, 600);
    });

    // Fallback if load event is slow or cached
    setTimeout(() => {
        if (!preloader.classList.contains('fade-out')) {
            preloader.classList.add('fade-out');
        }
    }, 3000);

    // ==========================================================================
    // DYNAMIC LANGUAGE SWITCHER (SPA ROUTER)
    // ==========================================================================
    function toggleLanguage() {
        state.lang = state.lang === 'tr' ? 'en' : 'tr';
        langBtn.textContent = state.lang === 'tr' ? 'EN' : 'TR';
        document.documentElement.lang = state.lang;
        document.title = translations[state.lang].title;

        // Traverse all elements with data-tr/data-en attributes and update contents
        const translatableElements = document.querySelectorAll('[data-tr]');
        translatableElements.forEach(el => {
            const trVal = el.getAttribute('data-tr');
            const enVal = el.getAttribute('data-en');
            
            // Check if element is an input placeholder
            if (el.tagName === 'INPUT' && el.nextElementSibling && el.nextElementSibling.tagName === 'LABEL') {
                // If it is label we translate the label, input placeholder is empty for css float labels
            } else if (el.hasAttribute('placeholder') && el.tagName === 'INPUT') {
                el.setAttribute('placeholder', state.lang === 'tr' ? trVal : enVal);
            } else {
                el.textContent = state.lang === 'tr' ? trVal : enVal;
            }
        });

        // Re-render timezone localized strings
        renderLocalizedDate();
        updateCountdown();
    }

    langBtn.addEventListener('click', toggleLanguage);

    // ==========================================================================
    // DYNAMIC LOCAL TIMEZONE CONVERTER
    // ==========================================================================
    // Target details: 2026-06-21 at 15:00 in Turkey (+03:00)
    const targetTimestamp = Date.parse(state.targetDateString);
    const targetDateObject = new Date(targetTimestamp);

    function renderLocalizedDate() {
        try {
            // Get client's target locale and timezone
            const clientLocale = state.lang === 'tr' ? 'tr-TR' : 'en-US';
            const clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            
            // Format dates using native Intl.DateTimeFormat API
            const dateFormatter = new Intl.DateTimeFormat(clientLocale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                weekday: 'long',
                timeZone: clientTimeZone
            });

            const timeFormatter = new Intl.DateTimeFormat(clientLocale, {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: clientTimeZone
            });

            const formattedDate = dateFormatter.format(targetDateObject);
            const formattedTime = timeFormatter.format(targetDateObject);

            // Separate date representation
            mainDateNode.textContent = formattedDate;
            mainTimeNode.textContent = state.lang === 'tr' ? `Saat ${formattedTime}` : `${formattedTime}`;

            // Status message regarding client timezone conversion
            const labelText = translations[state.lang].localTimeLabel;
            tzTextNode.textContent = `${labelText} ${clientTimeZone} (${formattedTime})`;

        } catch (e) {
            console.error("Timezone formatting error: ", e);
            // Secure graceful fallback
            mainDateNode.textContent = state.lang === 'tr' ? '21 Haziran 2026' : 'June 21, 2026';
            mainTimeNode.textContent = state.lang === 'tr' ? 'Pazar ✦ Saat 15:00' : 'Sunday ✦ 15:00';
            tzTextNode.textContent = "Eskişehir, Turkey";
        }
    }

    // Run date localization instantly
    renderLocalizedDate();

    // ==========================================================================
    // TIMEZONE-AWARE DYNAMIC COUNTDOWN ENGINE
    // ==========================================================================
    const cdDays = document.getElementById('cd-days');
    const cdHours = document.getElementById('cd-hours');
    const cdMinutes = document.getElementById('cd-minutes');
    const cdSeconds = document.getElementById('cd-seconds');
    const cdWrapper = document.getElementById('countdown-wrapper');

    function updateCountdown() {
        const now = Date.now();
        const diff = targetTimestamp - now;

        if (diff <= 0) {
            // Cap at 00:00:00:00 cleanly
            cdDays.textContent = '00';
            cdHours.textContent = '00';
            cdMinutes.textContent = '00';
            cdSeconds.textContent = '00';
            
            // Change countdown subtitle to dynamic greetings
            tzTextNode.textContent = translations[state.lang].countdownExpired;
            return;
        }

        // Mathematical timing splits
        const msPerSecond = 1000;
        const msPerMinute = msPerSecond * 60;
        const msPerHour = msPerMinute * 60;
        const msPerDay = msPerHour * 24;

        const days = Math.floor(diff / msPerDay);
        const hours = Math.floor((diff % msPerDay) / msPerHour);
        const minutes = Math.floor((diff % msPerHour) / msPerMinute);
        const seconds = Math.floor((diff % msPerMinute) / msPerSecond);

        // Render zero-padded string digits
        cdDays.textContent = String(days).padStart(2, '0');
        cdHours.textContent = String(hours).padStart(2, '0');
        cdMinutes.textContent = String(minutes).padStart(2, '0');
        cdSeconds.textContent = String(seconds).padStart(2, '0');
    }

    // Run immediate update and trigger regular precise ticks
    updateCountdown();
    const countdownTimer = setInterval(updateCountdown, 1000);

    // ==========================================================================
    // BACKGROUND AUDIO SOUNDSCAPE CORE
    // ==========================================================================
    function toggleMusic() {
        if (state.isMusicPlaying) {
            bgMusic.pause();
            musicBtn.classList.add('paused');
            state.isMusicPlaying = false;
        } else {
            bgMusic.play().then(() => {
                musicBtn.classList.remove('paused');
                state.isMusicPlaying = true;
            }).catch(err => {
                console.warn("Autoplay policy blocked instantaneous soundscapes. Interaction needed: ", err);
            });
        }
    }

    musicBtn.addEventListener('click', toggleMusic);

    // Unlock auto-play capabilities safely upon client's first interactive screen tap
    const firstInteractions = ['click', 'touchstart', 'keydown'];
    function unlockAutoplay() {
        if (!state.isMusicPlaying) {
            // Attempt standard play
            bgMusic.play().then(() => {
                musicBtn.classList.remove('paused');
                state.isMusicPlaying = true;
                cleanUpListeners();
            }).catch(() => {
                // Keep listeners until successful manual trigger or click
            });
        }
    }

    function cleanUpListeners() {
        firstInteractions.forEach(event => {
            document.removeEventListener(event, unlockAutoplay);
        });
    }

    firstInteractions.forEach(event => {
        document.addEventListener(event, unlockAutoplay, { once: true });
    });

    // ==========================================================================
    // NATIVE CALENDAR BUILD ENGINE
    // ==========================================================================
    // Event absolute details (UTC times matching June 21, 2026 15:00+03:00)
    // T15:00:00+03:00 in UTC is T12:00:00Z. Let's make it a 4 hour engagement: 12:00Z to 16:00Z
    const calEvent = {
        title: "Sinem & Mehmet Nişan Töreni",
        description: "Sinem ve Mehmet'in nişan törenine davetlisiniz. Sizleri aramızda görmekten onur duyacağız.",
        location: "Helen Garden, Eskişehir",
        startUTC: "20260621T120000Z",
        endUTC: "20260621T160000Z"
    };

    // Google Calendar URL compiler
    function compileGoogleCalendarUrl() {
        const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
        const titleComp = `&text=${encodeURIComponent(calEvent.title)}`;
        const datesComp = `&dates=${calEvent.startUTC}/${calEvent.endUTC}`;
        const detailsComp = `&details=${encodeURIComponent(calEvent.description)}`;
        const locationComp = `&location=${encodeURIComponent(calEvent.location)}`;
        return `${base}${titleComp}${datesComp}${detailsComp}${locationComp}`;
    }

    // Apple/iCal payload compiler & download trigger
    function downloadIcalPayload() {
        const icsContent = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Sinem Mehmet//Nisan Davetiyesi//TR",
            "BEGIN:VEVENT",
            "UID:sinem-mehmet-nisan-2026@mehmet-sinem.github.io",
            `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'}`,
            `DTSTART:${calEvent.startUTC}`,
            `DTEND:${calEvent.endUTC}`,
            `SUMMARY:${calEvent.title}`,
            `DESCRIPTION:${calEvent.description}`,
            `LOCATION:${calEvent.location}`,
            "END:VEVENT",
            "END:VCALENDAR"
        ].join("\r\n");

        // Synthesize dynamic blob download
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const blobUrl = URL.createObjectURL(blob);
        
        const tempLink = document.createElement('a');
        tempLink.href = blobUrl;
        tempLink.download = "sinem-mehmet-nisan.ics";
        document.body.appendChild(tempLink);
        tempLink.click();
        
        // Graceful cleaning
        document.body.removeChild(tempLink);
        URL.revokeObjectURL(blobUrl);
    }

    // Toggle Calendar Sub-Menu Dropdown
    calTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = calTrigger.getAttribute('aria-expanded') === 'true';
        calTrigger.setAttribute('aria-expanded', !isExpanded);
        calMenu.classList.toggle('show');
    });

    // Close Dropdown upon outer layout clicks
    document.addEventListener('click', () => {
        calTrigger.setAttribute('aria-expanded', 'false');
        calMenu.classList.remove('show');
    });

    calGoogle.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(compileGoogleCalendarUrl(), '_blank');
    });

    calIcal.addEventListener('click', (e) => {
        e.preventDefault();
        downloadIcalPayload();
    });

    // ==========================================================================
    // RSVP CUSTOM MODAL CONTROLS & LOCALSTORAGE CACHE
    // ==========================================================================
    function openRsvpModal() {
        rsvpModal.classList.add('show');
        rsvpModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock background scroll
        
        // Auto-fill existing inputs from cache if available
        const cachedRsvp = localStorage.getItem('sinem_mehmet_rsvp');
        if (cachedRsvp) {
            try {
                const parsed = JSON.parse(cachedRsvp);
                document.getElementById('rsvp-name').value = parsed.name || '';
                document.getElementById('rsvp-guests').value = parsed.guests || 1;
                const radios = document.getElementsByName('attendance');
                radios.forEach(radio => {
                    if (radio.value === parsed.attendance) radio.checked = true;
                });
            } catch (e) {
                console.error("Cache read error: ", e);
            }
        }
    }

    function closeRsvpModal() {
        rsvpModal.classList.remove('show');
        rsvpModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Release background scroll
        
        // Reset Success notifications after modal closes
        setTimeout(() => {
            rsvpForm.classList.remove('fade-out');
            rsvpSuccess.classList.remove('show');
            rsvpForm.reset();
        }, 500);
    }

    rsvpTrigger.addEventListener('click', openRsvpModal);
    rsvpClose.addEventListener('click', closeRsvpModal);
    
    // Close modal if guest clicks overlay backdrop
    rsvpModal.addEventListener('click', (e) => {
        if (e.target === rsvpModal) {
            closeRsvpModal();
        }
    });

    // Process RSVP Custom Form Submissions
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameVal = document.getElementById('rsvp-name').value.trim();
        const guestVal = parseInt(document.getElementById('rsvp-guests').value) || 1;
        const attendanceVal = document.querySelector('input[name="attendance"]:checked').value;

        // Compile payload structure
        const rsvpPayload = {
            name: nameVal,
            attendance: attendanceVal,
            guests: guestVal,
            timestamp: new Date().toISOString()
        };

        // Cache response in client's LocalStorage securely
        localStorage.setItem('sinem_mehmet_rsvp', JSON.stringify(rsvpPayload));

        // Create elegant fallback: Triggering direct, formatted RSVP Email Client to the hosts
        setTimeout(() => {
            const subject = translations[state.lang].rsvpMailSubject + nameVal;
            let body = '';
            
            if (attendanceVal === 'katiliyor') {
                body = translations[state.lang].rsvpMailBody
                    .replace('{name}', nameVal)
                    .replace('{status}', state.lang === 'tr' ? 'Katılıyorum' : 'Attending')
                    .replace('{guests}', guestVal);
            } else {
                body = translations[state.lang].rsvpMailBodyNo
                    .replace('{name}', nameVal)
                    .replace('{status}', state.lang === 'tr' ? 'Katılamıyorum' : 'Not Attending');
            }

            // Launch formatted native email dispatch
            window.location.href = `mailto:mehmetvesinem@gmail.com?subject=${subject}&body=${body}`;
        }, 1200);

        // Show elegant visual success feedback
        rsvpForm.classList.add('fade-out');
        setTimeout(() => {
            rsvpSuccess.classList.add('show');
        }, 300);
    });
});
