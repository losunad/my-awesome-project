document.addEventListener('DOMContentLoaded', function() {
    // Индикатор прогресса скролла
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
        width: 0%;
        z-index: 1000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const scrolled = (window.scrollY / (docHeight - winHeight)) * 100;
        progressBar.style.width = `${scrolled}%`;
    });

    // Подсветка активного раздела при скролле
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav__link');

    function highlightActiveSection() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('nav__link--active');
            if (link.getAttribute('href') === `#${current}` || 
                link.getAttribute('href').includes(current)) {
                link.classList.add('nav__link--active');
            }
        });
    }

    window.addEventListener('scroll', highlightActiveSection);

    // Плавный скролл для всех якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Улучшенные hover-эффекты для тач-устройств
    function handleTouchHover() {
        document.addEventListener('touchstart', function() {}, {passive: true});
        
        // Добавляем класс для тач-устройств
        if ('ontouchstart' in window || navigator.maxTouchPoints) {
            document.documentElement.classList.add('touch-device');
        } else {
            document.documentElement.classList.add('no-touch-device');
        }
    }

    handleTouchHover();

    // Анимация загрузки элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Применяем анимацию появления для секций и карточек
    document.querySelectorAll('.section, .card, .project-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Открытие/закрытие модалки
    const dlg = document.getElementById('contactDialog');
    const openBtn = document.getElementById('openDialog');
    const closeBtn = document.getElementById('closeDialog');
    const form = document.getElementById('contactForm');
    let lastActive = null;

    if (openBtn && dlg) {
        openBtn.addEventListener('click', () => {
            lastActive = document.activeElement;
            dlg.showModal();
            // Фокусируемся на первом поле формы
            const firstInput = dlg.querySelector('input, select, textarea, button');
            if (firstInput) firstInput.focus();
        });
    }

    if (closeBtn && dlg) {
        closeBtn.addEventListener('click', () => dlg.close('cancel'));
    }

    // Закрытие модалки по клику на затемненную область
    if (dlg) {
        dlg.addEventListener('click', (e) => {
            const dialogDimensions = dlg.getBoundingClientRect();
            if (
                e.clientX < dialogDimensions.left ||
                e.clientX > dialogDimensions.right ||
                e.clientY < dialogDimensions.top ||
                e.clientY > dialogDimensions.bottom
            ) {
                dlg.close('cancel');
            }
        });
    }

    // Валидация формы при отправке
    if (form) {
        form.addEventListener('submit', (e) => {
            // Сброс кастомных сообщений
            Array.from(form.elements).forEach(el => {
                if (el.setCustomValidity) {
                    el.setCustomValidity('');
                }
            });

            // Проверка встроенных ограничений
            if (!form.checkValidity()) {
                e.preventDefault();

                // Таргетированная валидация для email
                const email = form.elements.email;
                if (email && email.validity.typeMismatch) {
                    email.setCustomValidity('Введите корректный e-mail, например name@example.com');
                }

                // Таргетированная валидация для телефона
                const phone = form.elements.phone;
                if (phone && phone.validity.patternMismatch) {
                    phone.setCustomValidity('Введите телефон в формате +7 (XXX) XXX-XX-XX');
                }

                form.reportValidity();

                // A11y: подсветка проблемных полей
                Array.from(form.elements).forEach(el => {
                    if (el.willValidate) {
                        el.toggleAttribute('aria-invalid', !el.checkValidity());
                    }
                });
                return;
            }

            // Успешная «отправка» (без сервера)
            e.preventDefault();
            
            // Показываем сообщение об успехе
            showSuccessMessage();
            
            // Закрываем модальное окно с задержкой
            setTimeout(() => {
                if (dlg) dlg.close('success');
                form.reset();
            }, 2000);
        });
    }

    // Функция показа сообщения об успешной отправке
    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #4ecdc4;
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            z-index: 1001;
            font-weight: bold;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        successMessage.textContent = 'Сообщение отправлено успешно!';
        document.body.appendChild(successMessage);

        setTimeout(() => {
            successMessage.style.opacity = '0';
            successMessage.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                if (successMessage.parentNode) {
                    successMessage.parentNode.removeChild(successMessage);
                }
            }, 500);
        }, 2000);
    }

    // Возврат фокуса после закрытия модалки
    if (dlg) {
        dlg.addEventListener('close', () => {
            if (lastActive) {
                lastActive.focus();
            }
        });
    }

    // Обработка клавиши Escape для модалки
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dlg && dlg.open) {
            dlg.close('cancel');
        }
    });

    // Анимация для кнопок при наведении
    document.querySelectorAll('button, .btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Динамическая подгрузка изображений с lazy loading
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    console.log('JavaScript загружен успешно!');
});

// Добавляем обработчик ошибок для отладки
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});