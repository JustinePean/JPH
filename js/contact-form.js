/**
 * Contact Form Handler
 *
 * Provides client-side validation and form submission for the contact page.
 * Features:
 * - Real-time validation on blur
 * - Email format validation
 * - Required field validation
 * - Loading state during submission
 * - Success/error feedback
 * - Accessible error announcements
 */

(function () {
    'use strict';

    const form = document.getElementById('contact-form');
    if (!form) return;

    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    // Field configurations with their error elements
    const fields = {
        fullName: {
            el: document.getElementById('full-name'),
            errorEl: document.getElementById('name-error'),
            validate: (value) => {
                if (!value.trim()) return 'Full name is required';
                if (value.trim().length < 2) return 'Name must be at least 2 characters';
                return '';
            }
        },
        email: {
            el: document.getElementById('email'),
            errorEl: document.getElementById('email-error'),
            validate: (value) => {
                if (!value.trim()) return 'Email address is required';
                // RFC 5322 simplified email regex
                const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                if (!emailRegex.test(value.trim())) return 'Please enter a valid email address';
                return '';
            }
        },
        subject: {
            el: document.getElementById('subject'),
            errorEl: document.getElementById('subject-error'),
            validate: (value) => {
                if (!value.trim()) return 'Subject is required';
                if (value.trim().length < 3) return 'Subject must be at least 3 characters';
                return '';
            }
        },
        message: {
            el: document.getElementById('message'),
            errorEl: document.getElementById('message-error'),
            validate: (value) => {
                if (!value.trim()) return 'Message is required';
                if (value.trim().length < 10) return 'Message must be at least 10 characters';
                return '';
            }
        }
    };

    /**
     * Shows an error message for a field
     */
    function showError(fieldKey, message) {
        const field = fields[fieldKey];
        if (!field) return;

        field.el.classList.add('is-invalid');
        field.el.classList.remove('is-valid');
        field.el.setAttribute('aria-invalid', 'true');

        if (field.errorEl) {
            field.errorEl.textContent = message;
            field.errorEl.classList.add('is-visible');
        }
    }

    /**
     * Clears an error message for a field
     */
    function clearError(fieldKey) {
        const field = fields[fieldKey];
        if (!field) return;

        field.el.classList.remove('is-invalid');
        field.el.removeAttribute('aria-invalid');

        if (field.errorEl) {
            field.errorEl.textContent = '';
            field.errorEl.classList.remove('is-visible');
        }
    }

    /**
     * Marks a field as valid
     */
    function markValid(fieldKey) {
        const field = fields[fieldKey];
        if (!field) return;

        field.el.classList.remove('is-invalid');
        field.el.classList.add('is-valid');
        field.el.removeAttribute('aria-invalid');

        if (field.errorEl) {
            field.errorEl.textContent = '';
            field.errorEl.classList.remove('is-visible');
        }
    }

    /**
     * Validates a single field
     * @returns {boolean} true if valid
     */
    function validateField(fieldKey) {
        const field = fields[fieldKey];
        if (!field) return true;

        const error = field.validate(field.el.value);
        if (error) {
            showError(fieldKey, error);
            return false;
        }

        markValid(fieldKey);
        return true;
    }

    /**
     * Validates all fields
     * @returns {boolean} true if all valid
     */
    function validateAll() {
        let isValid = true;
        let firstInvalid = null;

        for (const key of Object.keys(fields)) {
            const fieldValid = validateField(key);
            if (!fieldValid && !firstInvalid) {
                firstInvalid = key;
            }
            isValid = isValid && fieldValid;
        }

        // Focus first invalid field for accessibility
        if (firstInvalid && fields[firstInvalid].el) {
            fields[firstInvalid].el.focus();
        }

        return isValid;
    }

    /**
     * Shows form-level status message
     */
    function showStatus(type, message) {
        formStatus.className = 'form-status';
        formStatus.classList.add(type === 'success' ? 'is-success' : 'is-error');
        formStatus.textContent = message;
        formStatus.style.display = 'block';

        // Scroll to status message
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Sets loading state on submit button
     */
    function setLoading(isLoading) {
        submitBtn.disabled = isLoading;
        submitBtn.classList.toggle('is-loading', isLoading);
    }

    /**
     * Handles form submission
     */
    async function handleSubmit(event) {
        event.preventDefault();

        // Clear previous status
        formStatus.className = 'form-status';
        formStatus.style.display = 'none';

        // Validate all fields
        if (!validateAll()) {
            showStatus('error', 'Please fix the errors above and try again.');
            return;
        }

        // Prepare form data
        const formData = {
            fullName: fields.fullName.el.value.trim(),
            email: fields.email.el.value.trim(),
            subject: fields.subject.el.value.trim(),
            message: fields.message.el.value.trim()
        };

        setLoading(true);

        try {
            // FormSubmit.co free endpoint — replace with your actual endpoint
            // This service forwards form submissions to your email
            const response = await fetch('https://formsubmit.co/ajax/justine@justinepeandh.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                showStatus('success', 'Thank you! Your message has been sent successfully. I\'ll get back to you within 24 hours.');
                form.reset();

                // Clear all validation states
                Object.keys(fields).forEach(key => {
                    fields[key].el.classList.remove('is-valid', 'is-invalid');
                    fields[key].el.removeAttribute('aria-invalid');
                });
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            // Fallback: open mailto with pre-filled data
            const mailtoSubject = encodeURIComponent(formData.subject);
            const mailtoBody = encodeURIComponent(
                `Name: ${formData.fullName}\nEmail: ${formData.email}\n\n${formData.message}`
            );
            showStatus('error', 'Could not send directly. Please email me at justine@justinepeandh.com or use the mailto link.');

            // Optional: trigger mailto as fallback
            // window.location.href = `mailto:justine@justinepeandh.com?subject=${mailtoSubject}&body=${mailtoBody}`;
        } finally {
            setLoading(false);
        }
    }

    // Attach event listeners
    form.addEventListener('submit', handleSubmit);

    // Real-time validation on blur
    Object.keys(fields).forEach(key => {
        const field = fields[key];
        if (field.el) {
            field.el.addEventListener('blur', () => {
                // Only validate if user has interacted (field has value or was focused before)
                if (field.el.value.trim() || field.el.classList.contains('is-invalid')) {
                    validateField(key);
                }
            });

            // Clear error on input (when user starts typing)
            field.el.addEventListener('input', () => {
                if (field.el.classList.contains('is-invalid')) {
                    const error = field.validate(field.el.value);
                    if (!error) {
                        markValid(key);
                    }
                }
            });
        }
    });
})();