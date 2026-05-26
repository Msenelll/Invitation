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

    // ==========================================================================
    // PREMIUM DARK RESUMABLE MEDIA UPLOADER LOGIC
    // ==========================================================================
    
    // Initialize Lucide icons on page load
    if (window.lucide) {
        window.lucide.createIcons();
    }
    
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwXbV7_1yxUjG9-U640nxOiDFpYxTAHcLT04ROWp4sH9J-2L5EsqTCSLlI2AQiVu5TD/exec";
    const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB fixed chunk size
    
    // DOM Elements
    const mediaFormState = document.getElementById('uploader-form-state');
    const mediaProgressState = document.getElementById('uploader-progress-state');
    const mediaSuccessState = document.getElementById('uploader-success-state');
    
    const mediaUploadForm = document.getElementById('media-upload-form');
    const dragDropZone = document.getElementById('drag-drop-zone');
    const mediaFileInput = document.getElementById('media-file-input');
    const selectedFilesQueue = document.getElementById('selected-files-queue');
    const filesList = document.getElementById('files-list');
    
    const currentUploadingFile = document.getElementById('current-uploading-file');
    const activeFilePct = document.getElementById('active-file-pct');
    const activeFileBar = document.getElementById('active-file-bar');
    const overallPct = document.getElementById('overall-pct');
    const overallBar = document.getElementById('overall-bar');
    
    const startUploadBtn = document.getElementById('start-upload-btn');
    const newUploadBtn = document.getElementById('new-upload-btn');
    const toastContainer = document.getElementById('toast-container');
    
    let selectedFiles = []; // Holds file objects

    // Toast Notification System
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconName = type === 'success' ? 'check-circle' : 'alert-circle';
        toast.innerHTML = `
            <i data-lucide="${iconName}" class="toast-icon"></i>
            <span class="toast-message">${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        // Hide after 4 seconds
        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    }

    // Drag and drop events
    ['dragenter', 'dragover'].forEach(eventName => {
        dragDropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragDropZone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dragDropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragDropZone.classList.remove('dragover');
        }, false);
    });

    dragDropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFilesSelection(files);
    });

    dragDropZone.addEventListener('click', () => {
        mediaFileInput.click();
    });

    mediaFileInput.addEventListener('change', (e) => {
        handleFilesSelection(e.target.files);
    });

    function handleFilesSelection(files) {
        const maxSize = 510 * 1024 * 1024; // 510MB
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Validate mimeType (images or videos only)
            if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
                showToast(
                    state.lang === 'tr' 
                        ? `"${file.name}" desteklenmeyen bir dosya türü. Sadece görsel veya video yükleyebilirsiniz.`
                        : `"${file.name}" is not supported. Only images and videos are allowed.`,
                    'error'
                );
                continue;
            }
            
            // Validate size
            if (file.size > maxSize) {
                showToast(
                    state.lang === 'tr'
                        ? `"${file.name}" 510MB sınırını aşıyor.`
                        : `"${file.name}" exceeds the 510MB limit.`,
                    'error'
                );
                continue;
            }
            
            // Check for duplicates
            if (selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                continue;
            }
            
            selectedFiles.push(file);
        }
        
        renderFilesQueue();
    }

    function renderFilesQueue() {
        filesList.innerHTML = '';
        
        if (selectedFiles.length === 0) {
            selectedFilesQueue.classList.add('hidden');
            return;
        }
        
        selectedFilesQueue.classList.remove('hidden');
        
        selectedFiles.forEach((file, index) => {
            const isVideo = file.type.startsWith('video/');
            const iconName = isVideo ? 'video' : 'image';
            const sizeStr = formatBytes(file.size);
            
            const li = document.createElement('li');
            li.className = 'file-item';
            li.innerHTML = `
                <div class="file-info">
                    <i data-lucide="${iconName}" class="file-icon"></i>
                    <span class="file-name" title="${file.name}">${file.name}</span>
                    <span class="file-size">${sizeStr}</span>
                </div>
                <button type="button" class="remove-file-btn" data-index="${index}" aria-label="Remove File">
                    <i data-lucide="trash-2"></i>
                </button>
            `;
            
            filesList.appendChild(li);
        });
        
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        // Remove file button handler
        const removeBtns = filesList.querySelectorAll('.remove-file-btn');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.getAttribute('data-index'));
                selectedFiles.splice(idx, 1);
                renderFilesQueue();
            });
        });
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    // Stack-overflow safe Base64 chunk encoder
    function uint8ArrayToBase64(uint8) {
        let binary = "";
        const len = uint8.length;
        const chunk = 16384; 
        for (let i = 0; i < len; i += chunk) {
            const slice = uint8.subarray(i, i + chunk);
            binary += String.fromCharCode.apply(null, slice);
        }
        return btoa(binary);
    }

    function readChunkAsBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const arrayBuffer = e.target.result;
                const uint8 = new Uint8Array(arrayBuffer);
                try {
                    const base64 = uint8ArrayToBase64(uint8);
                    resolve(base64);
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = function(err) {
                reject(err);
            };
            reader.readAsArrayBuffer(blob);
        });
    }

    // Exponential Backoff Retry mechanism
    async function sendRequestWithRetry(payload, retries = 3, delay = 1000) {
        try {
            const response = await fetch(SCRIPT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || "Server responded with failure");
            }
            
            return data;
        } catch (error) {
            if (retries > 0) {
                console.warn(`API call failed. Retrying in ${delay}ms... (${retries} attempts remaining). Error:`, error);
                await new Promise(resolve => setTimeout(resolve, delay));
                return sendRequestWithRetry(payload, retries - 1, delay * 2);
            }
            throw error;
        }
    }

    function switchState(stateName) {
        mediaFormState.classList.remove('active');
        mediaProgressState.classList.remove('active');
        mediaSuccessState.classList.remove('active');
        
        if (stateName === 'form') {
            mediaFormState.classList.add('active');
        } else if (stateName === 'progress') {
            mediaProgressState.classList.add('active');
        } else if (stateName === 'success') {
            mediaSuccessState.classList.add('active');
        }
    }
    
    function updateFileProgress(fileName, pct) {
        activeFilePct.textContent = `${pct}%`;
        activeFileBar.style.width = `${pct}%`;
    }
    
    function updateOverallProgress(currentFileIndex, totalFiles, overallPctVal, totalBytesUploaded) {
        overallPct.textContent = `${overallPctVal}%`;
        overallBar.style.width = `${overallPctVal}%`;
    }

    // Submit Action Upload Trigger
    mediaUploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nameVal = document.getElementById('uploader-name').value.trim();
        const surnameVal = document.getElementById('uploader-surname').value.trim();
        
        if (selectedFiles.length === 0) {
            showToast(
                state.lang === 'tr' 
                    ? "Lütfen yüklenecek en az bir dosya seçin."
                    : "Please select at least one file to upload.",
                'error'
            );
            return;
        }
        
        // Disable submit button
        startUploadBtn.disabled = true;
        
        // Transition to Progress Card
        switchState('progress');
        
        let rowNumber = null;
        let folderId = null;
        
        try {
            updateFileProgress("", 0);
            updateOverallProgress(0, selectedFiles.length, 0, 0);
            
            // 1. Create Folder
            currentUploadingFile.textContent = state.lang === 'tr' ? "Google Drive klasörü oluşturuluyor..." : "Creating Google Drive folder...";
            const folderData = await sendRequestWithRetry({
                action: "createFolder",
                name: nameVal,
                surname: surnameVal
            });
            folderId = folderData.folderId;
            const folderUrl = folderData.folderUrl;
            
            // 2. Log Upload Start
            currentUploadingFile.textContent = state.lang === 'tr' ? "Yükleme günlüğü başlatılıyor..." : "Initializing upload log...";
            const startData = await sendRequestWithRetry({
                action: "logUploadStart",
                name: nameVal,
                surname: surnameVal,
                fileNames: selectedFiles.map(f => f.name),
                folderUrl: folderUrl,
                documentCount: selectedFiles.length
            });
            rowNumber = startData.rowNumber;
            
            // 3. Upload Files
            let totalBytesToUpload = selectedFiles.reduce((acc, f) => acc + f.size, 0);
            let totalBytesUploaded = 0;
            
            for (let fIdx = 0; fIdx < selectedFiles.length; fIdx++) {
                const file = selectedFiles[fIdx];
                currentUploadingFile.textContent = file.name;
                
                updateFileProgress(file.name, 0);
                
                // Initiate Resumable Session
                const initData = await sendRequestWithRetry({
                    action: "initiateUpload",
                    fileName: file.name,
                    fileSize: file.size,
                    mimeType: file.type || "application/octet-stream",
                    folderId: folderId
                });
                
                const uploadUrl = initData.uploadUrl;
                
                // Start uploading chunks
                let start = 0;
                while (start < file.size) {
                    const end = Math.min(start + CHUNK_SIZE, file.size);
                    const chunk = file.slice(start, end);
                    
                    const chunkBase64 = await readChunkAsBase64(chunk);
                    
                    await sendRequestWithRetry({
                        action: "uploadChunk",
                        uploadUrl: uploadUrl,
                        chunkBase64: chunkBase64,
                        start: start,
                        end: end,
                        totalSize: file.size
                    });
                    
                    const uploadedInChunk = end - start;
                    totalBytesUploaded += uploadedInChunk;
                    
                    const filePct = Math.round((end / file.size) * 100);
                    updateFileProgress(file.name, filePct);
                    
                    const overallPctVal = Math.round((totalBytesUploaded / totalBytesToUpload) * 100);
                    updateOverallProgress(fIdx + 1, selectedFiles.length, overallPctVal, totalBytesUploaded);
                    
                    start = end;
                }
            }
            
            // 4. Log Upload Complete
            currentUploadingFile.textContent = state.lang === 'tr' ? "Yükleme tamamlanıyor..." : "Completing upload...";
            await sendRequestWithRetry({
                action: "logUploadComplete",
                rowNumber: rowNumber
            });
            
            showToast(
                state.lang === 'tr' 
                    ? "Tüm dosyalarınız başarıyla yüklendi!" 
                    : "All your files uploaded successfully!",
                'success'
            );
            switchState('success');
            
        } catch (error) {
            console.error("Upload workflow failed:", error);
            showToast(
                state.lang === 'tr'
                    ? "Bir hata oluştu. Lütfen tekrar deneyin."
                    : "An error occurred. Please try again.",
                'error'
            );
            
            // Log upload failed if rowNumber was successfully fetched
            if (rowNumber !== null) {
                try {
                    await fetch(SCRIPT_URL, {
                        method: "POST",
                        headers: {
                            "Content-Type": "text/plain;charset=utf-8"
                        },
                        body: JSON.stringify({
                            action: "logUploadFailed",
                            rowNumber: rowNumber
                        })
                    });
                } catch (failErr) {
                    console.error("Failed to log failure status to server:", failErr);
                }
            }
            
            switchState('form');
            startUploadBtn.disabled = false;
        }
    });

    // Reset Form for New Uploads
    newUploadBtn.addEventListener('click', () => {
        selectedFiles = [];
        renderFilesQueue();
        mediaUploadForm.reset();
        switchState('form');
        startUploadBtn.disabled = false;
    });

});
