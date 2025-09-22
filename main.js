// Открытие/закрытие модалки
const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
let lastActive = null;

openBtn.addEventListener('click', () => {
    lastActive = document.activeElement;
    dlg.showModal(); // модальный режим + затемнение
    dlg.querySelector('input, select, textarea, button')?.focus();
});

closeBtn.addEventListener('click', () => dlg.close('cancel'));

// Валидация формы при отправке
form?.addEventListener('submit', (e) => {
    // 1) Сброс кастомных сообщений
    [...form.elements].forEach(el => el.setCustomValidity?.(''));

    // 2) Проверка встроенных ограничений
    if (!form.checkValidity()) {
        e.preventDefault();

        // Пример: таргетированное сообщение для email
        const email = form.elements.email;
        if (email?.validity.typeMismatch) {
            email.setCustomValidity('Введите корректный e-mail, например name@example.com');
        }

        form.reportValidity(); // показать браузерные подсказки

        // A11y: подсветка проблемных полей
        [...form.elements].forEach(el => {
            if (el.willValidate) el.toggleAttribute('aria-invalid', !el.checkValidity());
        });
        return;
    }

    // 3) Успешная «отправка» (без сервера)
    e.preventDefault();
    // Закрываем модальное окно
    dlg.close('success');
    form.reset();
});

// Возврат фокуса после закрытия модалки
dlg.addEventListener('close', () => {
    lastActive?.focus();
});