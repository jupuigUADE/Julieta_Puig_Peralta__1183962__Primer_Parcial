// Modo oscuro
class DarkModeManager {
    constructor() {
        this.darkModeKey = 'darkMode';
        this.init();
    }

    init() {
        // Cargar el estado guardado del modo oscuro
        this.loadDarkModeState();
        
        // Configurar event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        const toggleButton = document.getElementById('toggle-dark-mode');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => this.toggleDarkMode());
        }
    }

    loadDarkModeState() {
        const isDarkMode = localStorage.getItem(this.darkModeKey) === 'true';
        if (isDarkMode) {
            this.enableDarkMode();
        } else {
            this.disableDarkMode();
        }
    }

    toggleDarkMode() {
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDarkMode) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    }

    enableDarkMode() {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem(this.darkModeKey, 'true');
        this.updateToggleButton('☀️');
    }

    disableDarkMode() {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem(this.darkModeKey, 'false');
        this.updateToggleButton('🌙');
    }

    updateToggleButton(icon) {
        const toggleButton = document.getElementById('toggle-dark-mode');
        if (toggleButton) {
            toggleButton.textContent = icon;
        }
    }
}

// Hamburger Menu Manager
class HamburgerMenuManager {
    constructor() {
        this.hamburger = document.getElementById('hamburger-menu');
        this.nav = document.querySelector('.nav');
        this.init();
    }

    init() {
        if (!this.hamburger || !this.nav) return;
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.hamburger.contains(e.target) && !this.nav.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.nav.classList.toggle('active');
    }

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.nav.classList.remove('active');
    }
}

// Validación del formulario
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.errors = {};
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.setupEventListeners();
        this.setupRealTimeValidation();
    }

    setupEventListeners() {
        // Evento de envío del formulario
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validateForm();
        });

        // Botón de limpiar
        const limpiarBtn = document.getElementById('limpiar-btn');
        if (limpiarBtn) {
            limpiarBtn.addEventListener('click', () => this.clearForm());
        }
    }

    setupRealTimeValidation() {
        // Validación en tiempo real para todos los campos
        const fields = this.form.querySelectorAll('input, textarea');
        fields.forEach(field => {
            // Validar cuando el usuario sale del campo
            field.addEventListener('blur', () => {
                this.validateField(field);
            });

            // Limpiar errores cuando el usuario empieza a escribir
            field.addEventListener('input', () => {
                if (this.errors[field.name]) {
                    this.clearFieldError(field.name);
                }
            });
        });
    }

    validateForm() {
        this.clearAllErrors();
        let isValid = true;

        // Validar todos los campos
        const fields = this.form.querySelectorAll('input, textarea');
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (isValid) {
            this.showSuccessMessage();
        }

        return isValid;
    }

    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        let isValid = true;

        // Limpiar error previo
        this.clearFieldError(fieldName);

        switch (fieldName) {
            case 'nombre':
                if (!value) {
                    this.setFieldError(fieldName, 'El nombre es obligatorio.');
                    isValid = false;
                } else if (value.length < 2) {
                    this.setFieldError(fieldName, 'El nombre debe tener al menos 2 caracteres.');
                    isValid = false;
                } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
                    this.setFieldError(fieldName, 'El nombre solo puede contener letras y espacios.');
                    isValid = false;
                }
                break;

            case 'email':
                if (!value) {
                    this.setFieldError(fieldName, 'El correo electrónico es obligatorio.');
                    isValid = false;
                } else if (!this.isValidEmail(value)) {
                    this.setFieldError(fieldName, 'Ingrese un correo electrónico válido.');
                    isValid = false;
                }
                break;

            case 'telefono':
                // El teléfono es opcional, pero si se ingresa debe ser válido
                if (value && !this.isValidPhone(value)) {
                    this.setFieldError(fieldName, 'Ingrese un número de teléfono válido.');
                    isValid = false;
                }
                break;

            case 'asunto':
                if (!value) {
                    this.setFieldError(fieldName, 'El asunto es obligatorio.');
                    isValid = false;
                } else if (value.length < 3) {
                    this.setFieldError(fieldName, 'El asunto debe tener al menos 3 caracteres.');
                    isValid = false;
                }
                break;

            case 'mensaje':
                if (!value) {
                    this.setFieldError(fieldName, 'El mensaje es obligatorio.');
                    isValid = false;
                } else if (value.length < 10) {
                    this.setFieldError(fieldName, 'El mensaje debe tener al menos 10 caracteres.');
                    isValid = false;
                }
                break;
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        // Acepta diferentes formatos de teléfono
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
        return phoneRegex.test(phone);
    }

    setFieldError(fieldName, message) {
        this.errors[fieldName] = message;
        
        // Mostrar el error en la interfaz
        const errorElement = document.getElementById(`error-${fieldName}`);
        const fieldElement = document.querySelector(`[name="${fieldName}"]`);
        const formGroup = fieldElement?.closest('.form-group');

        if (errorElement) {
            errorElement.textContent = message;
        }

        if (formGroup) {
            formGroup.classList.add('error');
        }
    }

    clearFieldError(fieldName) {
        delete this.errors[fieldName];
        
        const errorElement = document.getElementById(`error-${fieldName}`);
        const fieldElement = document.querySelector(`[name="${fieldName}"]`);
        const formGroup = fieldElement?.closest('.form-group');

        if (errorElement) {
            errorElement.textContent = '';
        }

        if (formGroup) {
            formGroup.classList.remove('error');
        }
    }

    clearAllErrors() {
        this.errors = {};
        
        // Limpiar todos los mensajes de error
        const errorElements = this.form.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
        });

        // Remover clase de error de todos los grupos
        const formGroups = this.form.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('error');
        });
    }

    clearForm() {
        const fields = this.form.querySelectorAll('input, textarea');
        fields.forEach(field => {
            field.value = '';
        });

        this.clearAllErrors();

        const firstField = this.form.querySelector('input, textarea');
        if (firstField) {
            firstField.focus();
        }
    }

    showSuccessMessage() {
        alert('¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.');
        this.clearForm();
    }
}

// Utilidades adicionales
class Utils {
    // Función para scroll suave
    static smoothScroll(target) {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Inicialización cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    new DarkModeManager();
    new HamburgerMenuManager();
    
    if (document.getElementById('contacto-form')) {
        new FormValidator('contacto-form');
    }
});

// Prevenir el comportamiento por defecto en formularios
document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form.tagName === 'FORM') {
        if (!form.action || form.action === window.location.href) {
            e.preventDefault();
        }
    }
});
