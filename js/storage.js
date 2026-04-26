// Web Storage API та File API для Київстар
class TariffSelector {
    constructor() {
        this.storageKey = 'kyivstar_selected_tariff';
        this.init();
    }
    
    init() {
        const tariffSelect = document.getElementById('tariffType');
        if (tariffSelect) {
            tariffSelect.addEventListener('change', (e) => {
                localStorage.setItem(this.storageKey, e.target.value);
                this.showTariffBenefits(e.target.value);
            });
        }

        this.loadSelectedTariff();
    }
    
    loadSelectedTariff() {
        const savedTariff = localStorage.getItem(this.storageKey);
        if (savedTariff) {
            const select = document.getElementById('tariffType');
            if (select) {
                select.value = savedTariff;
                this.showTariffBenefits(savedTariff);
            }
        }
    }
    
    showTariffBenefits(tariffId) {
        const benefits = {
            'smart': '✅ Безлімітні дзвінки на інші мережі<br>✅ 15GB швидкісного інтернету<br>✅ 1000 SMS<br>✅ Безкоштовні дзвінки по Україні<br>✅ 5GB соціальних мереж',
            'unlimited': '✅ Безлімітний 4G/5G інтернет<br>✅ 1000 хвилин на інші мережі<br>✅ Безлімітні SMS<br>✅ Роумінг в Європі<br>✅ Безліміт на соціальні мережі',
            'premium': '✅ Максимальна швидкість 5G<br>✅ Безлімітні дзвінки та SMS<br>✅ Преміум підтримка 24/7<br>✅ Персональний менеджер<br>✅ Роумінг у 45 країнах',
            'business': '✅ Корпоративний пакет послуг<br>✅ Пріоритетне обслуговування<br>✅ Додаткові знижки<br>✅ Індивідуальні умови<br>✅ Технічна підтримка для бізнесу'
        };
        
        const benefitElement = document.getElementById('tariffBenefit');
        if (benefitElement && benefits[tariffId]) {
            benefitElement.innerHTML = benefits[tariffId];
            benefitElement.style.display = 'block';
        } else if (benefitElement) {
            benefitElement.style.display = 'none';
        }
    }
}

class SupportFormSaver {
    constructor() {
        this.storageKey = 'kyivstar_support_form';
        this.init();
    }
    
    init() {
        const form = document.getElementById('supportForm');
        if (!form) return;

        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', this.debounce(() => {
                this.saveFormData();
            }, 1000));
      
            if (input.type === 'radio' || input.type === 'checkbox') {
                input.addEventListener('change', this.debounce(() => {
                    this.saveFormData();
                }, 1000));
            }
        });
        
        this.loadFormData();
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            setTimeout(() => this.clearData(), 1000);
        });
    }
    
    saveFormData() {
        const form = document.getElementById('supportForm');
        if (!form) return;
        
        const formData = new FormData(form);
        const data = {};
       
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        const allInputs = form.querySelectorAll('input, select, textarea');
        allInputs.forEach(input => {
            if (input.type === 'radio') {
                if (input.checked) {
                    data[input.name] = input.value;
                }
            } else if (input.type === 'checkbox') {
                data[input.name] = input.checked;
            } else if (!data[input.name] && input.value) {
                data[input.name] = input.value;
            }
        });
        
        data.lastSaved = new Date().toLocaleString();
        
        localStorage.setItem(this.storageKey, JSON.stringify(data));
        this.showSaveIndicator();
        console.log('Дані форми збережено:', data);
    }
    
    loadFormData() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            const data = JSON.parse(saved);
            const form = document.getElementById('supportForm');
            if (!form) return;
   
            for (const [name, value] of Object.entries(data)) {
                if (name === 'lastSaved') continue;
                
                const element = form.querySelector(`[name="${name}"]`);
                if (!element) continue;
                
                if (element.type === 'radio') {
                    const radioToCheck = form.querySelector(`[name="${name}"][value="${value}"]`);
                    if (radioToCheck) radioToCheck.checked = true;
                } else if (element.type === 'checkbox') {
                    element.checked = value;
                } else {
                    element.value = value;
                }
            }
            
            console.log('Дані форми відновлено:', data.lastSaved);
        }
    }
    
    showSaveIndicator() {
        const oldIndicator = document.querySelector('.save-indicator');
        if (oldIndicator) oldIndicator.remove();
        
        const indicator = document.createElement('div');
        indicator.className = 'save-indicator';
        indicator.textContent = '✅ Дані форми збережено';
        indicator.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background: #28a745; color: white; padding: 10px 15px;
            border-radius: 5px; z-index: 1000; font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(indicator);
        
        setTimeout(() => indicator.remove(), 2000);
    }
    
    clearData() {
        localStorage.removeItem(this.storageKey);
        console.log('Дані форми очищено');
        alert('Форма успішно відправлена! Дані очищено.');
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

class ScreenshotUploader {
    constructor() {
        this.storageKey = 'kyivstar_screenshots';
        this.init();
    }
    
    init() {
        const uploadBtn = document.getElementById('screenshotUpload');
        const preview = document.getElementById('screenshotPreview');
        
        if (uploadBtn && preview) {
            uploadBtn.addEventListener('change', (e) => this.handleScreenshot(e, preview));
        }
        
        this.loadSavedScreenshots();
    }
    
    handleScreenshot(event, preview) {
        const file = event.target.files[0];
        if (!file || !file.type.startsWith('image/')) return;
        
        if (file.size > 3 * 1024 * 1024) {
            alert('Скріншот занадто великий. Максимум 3MB');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const screenshotData = {
                filename: file.name,
                dataUrl: e.target.result,
                timestamp: new Date().toISOString()
            };
            
            this.addScreenshotPreview(preview, screenshotData);
            this.saveScreenshot(screenshotData);
        };
        reader.readAsDataURL(file);
    }
    
    addScreenshotPreview(container, screenshotData, isSaved = false) {
        const preview = document.createElement('div');
        preview.className = 'screenshot-preview';
        preview.innerHTML = `
            <img src="${screenshotData.dataUrl}" alt="${screenshotData.filename}">
            <button onclick="this.parentElement.remove(); screenshotUploader.removeScreenshot('${screenshotData.timestamp}')">×</button>
            ${isSaved ? '<span class="saved-badge">🔄 Відновлено</span>' : ''}
        `;
        container.appendChild(preview);
    }
    
    saveScreenshot(screenshotData) {
        let screenshots = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        screenshots.push(screenshotData);
        
        if (screenshots.length > 5) {
            screenshots = screenshots.slice(-5);
        }
        
        localStorage.setItem(this.storageKey, JSON.stringify(screenshots));
        console.log('Скріншот збережено:', screenshotData.filename);
    }
    
    loadSavedScreenshots() {
        const saved = localStorage.getItem(this.storageKey);
        const preview = document.getElementById('screenshotPreview');
        
        if (saved && preview) {
            const screenshots = JSON.parse(saved);
            screenshots.forEach(screenshot => {
                this.addScreenshotPreview(preview, screenshot, true);
            });
            console.log('Відновлено скріншоти:', screenshots.length);
        }
    }
    
    removeScreenshot(timestamp) {
        let screenshots = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        screenshots = screenshots.filter(s => s.timestamp !== timestamp);
        localStorage.setItem(this.storageKey, JSON.stringify(screenshots));
        console.log('Скріншот видалено');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new TariffSelector();
    new SupportFormSaver(); 
    window.screenshotUploader = new ScreenshotUploader();
});