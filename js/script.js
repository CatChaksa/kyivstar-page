
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сторінка завантажена!');
   
    const prioritySlider = document.getElementById('priority');
    const priorityOutput = document.getElementById('priorityValue');

    const priorityLabels = {
        1: 'Дуже низька',
        2: 'Низька', 
        3: 'Середня',
        4: 'Висока',
        5: 'Критична'
    };

    if (prioritySlider && priorityOutput) {
        prioritySlider.addEventListener('input', function() {
            priorityOutput.textContent = priorityLabels[this.value] || 'Середня';
        });
    }

    const tariffForm = document.getElementById('tariffForm');
    const supportForm = document.getElementById('supportForm');
    const paymentForm = document.getElementById('paymentForm');
    const serviceForm = document.getElementById('serviceForm');

    if (tariffForm) {
        tariffForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Дякуємо за заявку! Наш менеджер зв\'яжеться з вами протягом 15 хвилин для підтвердження тарифу.');
            this.reset();
        });
    }

    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Ваш запит прийнято! Наш фахівець зв\'яжеться з вами для вирішення проблеми.');
            this.reset();
            if (priorityOutput) {
                priorityOutput.textContent = 'Середня';
            }
        });
    }

    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Оплата успішно проведена! Кошти зарахуються на рахунок протягом 2 хвилин.');
            this.reset();
        });
    }

    if (serviceForm) {
        serviceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Ви успішно записані в сервісний центр! Очікуйте SMS-підтвердження.');
            this.reset();
        });
    }

    const appointmentDate = document.getElementById('appointmentDate');
    if (appointmentDate) {
        const today = new Date().toISOString().split('T')[0];
        appointmentDate.min = today;
    }

    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.startsWith('38')) {
                value = value.substring(2);
            }
            
            if (value.length > 0) {
                let formatted = '+38 (';
                
                if (value.length > 0) {
                    formatted += value.substring(0, 3);
                }
                if (value.length > 3) {
                    formatted += ') ' + value.substring(3, 6);
                }
                if (value.length > 6) {
                    formatted += '-' + value.substring(6, 8);
                }
                if (value.length > 8) {
                    formatted += '-' + value.substring(8, 10);
                }
                
                e.target.value = formatted;
            }
        });
    });

    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .form-card, .stat-item');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
            }
        });
    };

    const animatedElements = document.querySelectorAll('.feature-card, .form-card, .stat-item');
    animatedElements.forEach(element => {
        element.style.opacity = "0";
        element.style.transform = "translateY(30px)";
        element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    initVideoSection();
    initBackgroundMusic();

    const connectButton = document.getElementById('connectButton');
    if (connectButton) {
        connectButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (window.energyBurst) {
                window.energyBurst.triggerBurst();
            }
            
            setTimeout(() => {
                const formsSection = document.getElementById('forms');
                if (formsSection) {
                    formsSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 400);
        });
    }

    window.energyBurst = new EnergyBurst('connectButton');

    console.log('Всі скрипти успішно завантажені!');
});

function initVideoSection() {
    const progressBar = document.querySelector('.video-stats progress');
    const meter = document.querySelector('.video-stats meter');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('Video section is visible');
            }
        });
    });
    
    const videoSection = document.querySelector('.video-section');
    if (videoSection) {
        observer.observe(videoSection);
    }
}

function initBackgroundMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const playBtn = document.getElementById('playMusic');
    const pauseBtn = document.getElementById('pauseMusic');
    const stopBtn = document.getElementById('stopMusic');
    const volumeText = document.getElementById('volumeText');

    if (bgMusic) {
        bgMusic.volume = 0.3; 
        bgMusic.loop = true; 
        
        let isStopped = false;
        let stopPosition = 0;

        const startBackgroundMusic = () => {
            bgMusic.play().then(() => {
                console.log('Фонова музика автоматично запущена');
                updateVolumeText();
            }).catch(error => {
                console.log('Автовідтворення заблоковано:', error);
                if (volumeText) volumeText.innerHTML = '🔇 Натисніть ▶';
            });
        };

        const updateVolumeText = () => {
            if (!volumeText) return;
            if (bgMusic.paused || isStopped) {
                volumeText.textContent = isStopped ? '⏹ Зупинено' : '⏸ Пауза';
            } else {
                volumeText.textContent = `🔊 ${Math.round(bgMusic.volume * 100)}%`;
            }
        };

        window.addEventListener('load', startBackgroundMusic);
        
        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                if (isStopped) {
                    bgMusic.currentTime = stopPosition;
                    isStopped = false;
                }
                
                if (bgMusic.paused) {
                    bgMusic.play().then(() => {
                        updateVolumeText();
                    });
                }
            });
        }
        
        if (pauseBtn) {
            pauseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!bgMusic.paused && !isStopped) {
                    bgMusic.pause();
                    updateVolumeText();
                }
            });
        }
        
        if (stopBtn) {
            stopBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                if (isStopped) {
                    bgMusic.currentTime = stopPosition;
                    bgMusic.play();
                    isStopped = false;
                    updateVolumeText();
                } else {
                    stopPosition = bgMusic.currentTime;
                    bgMusic.pause();
                    isStopped = true;
                    updateVolumeText();
                }
            });
        }

        bgMusic.addEventListener('play', updateVolumeText);
        bgMusic.addEventListener('pause', () => {
            if (!isStopped) {
                updateVolumeText();
            }
        });

        window.addEventListener('beforeunload', () => {
            bgMusic.pause();
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                bgMusic.pause();
            } else if (!bgMusic.paused && !isStopped) {
                bgMusic.play().catch(e => console.log('Не вдалось продовжити:', e));
            }
        });

        updateVolumeText();
    }
}

window.addEventListener('error', function(e) {
    console.log('Сталася помилка:', e.error);
});