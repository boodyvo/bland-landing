// Create a global namespace for the widget
window.VocalyWidget = (function() {
    // Add modalCounter to ensure unique IDs for multiple modals
    let modalCounter = 0;
    
    function createWidget(config) {
        const {
            apiKey,
            agentId,
            fromNumber,
            serverUrl = 'https://api.vocalyai.com',  // Updated default server URL
            primaryColor = '#1a5eff',
            textColor = '#ffffff',
            audioSettings = {
                VoiceID: "TcFVFGKruwp5AI74cZL1"
            },
            language = "en",
            formFields = [
                {
                    name: 'name',
                    displayTitle: 'Name',
                    type: 'text',
                    placeholder: 'Enter your name',
                    description: 'How our assistant will address you during the call',
                    required: true
                },
                {
                    name: 'email',
                    displayTitle: 'Email',
                    type: 'email',
                    placeholder: 'your@email.com',
                    description: "We'll send you the call transcript here",
                    required: true
                },
                {
                    name: 'phone_number',  // This name is required and shouldn't be changed
                    displayTitle: 'Phone Number',
                    type: 'tel',
                    placeholder: '(555) 000-0000',
                    description: "The number we'll call you on",
                    required: true
                }
            ]
        } = config;

        // Add phone number field validation
        function validateFormFields(fields) {
            const hasPhoneField = fields.some(field => field.name === 'phone_number');
            if (!hasPhoneField) {
                console.error('Vocaly Widget: phone_number field is required in formFields configuration');
                return false;
            }
            return true;
        }

        // Validate required parameters and phone field
        if (!apiKey || !agentId || !fromNumber) {
            console.error('Vocaly Widget: Missing required parameters (apiKey, agentId, or fromNumber)');
            return;
        }

        if (!validateFormFields(formFields)) {
            return;
        }

        // Create CSS with dynamic colors
        const style = document.createElement('style');
        style.textContent = `
            .vocaly-widget-button {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: ${primaryColor};
                color: ${textColor};
                width: 60px;
                height: 60px;
                border-radius: 50%;
                cursor: pointer;
                border: none;
                font-family: system-ui, -apple-system, sans-serif;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s ease;
                animation: vocalyPulse 2s infinite;
            }

            .vocaly-widget-button:hover {
                transform: scale(1.05);
                background-color: ${adjustColor(primaryColor, -10)};
            }

            .vocaly-widget-button svg {
                width: 24px;
                height: 24px;
                fill: currentColor;
            }

            .vocaly-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
                z-index: 10001;
                font-family: system-ui, -apple-system, sans-serif;
                animation: vocalyFadeIn 0.3s ease;
            }

            @keyframes vocalyFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            .vocaly-modal-content {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: white;
                padding: 32px 32px 48px;
                border-radius: 16px;
                width: 90%;
                max-width: 440px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                // animation: vocalySlideUp 0.3s ease;
            }

            @keyframes vocalySlideUp {
                from { transform: translate(-50%, -45%); opacity: 0; }
                to { transform: translate(-50%, -50%); opacity: 1; }
            }

            .vocaly-close {
                position: absolute;
                right: 16px;
                top: 16px;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: #6b7280;
                border: none;
                background: none;
                opacity: 0.7;
                transition: opacity 0.2s ease;
                padding: 0;
                z-index: 1;
            }

            .vocaly-close:hover {
                opacity: 1;
            }

            .vocaly-close svg {
                width: 20px;
                height: 20px;
            }

            .vocaly-title {
                font-size: 24px;
                font-weight: 600;
                color: #111827;
                margin-bottom: 24px;
                padding-right: 40px;
                text-align: left;
            }

            .vocaly-form-group {
                margin-bottom: 20px;
            }

            .vocaly-label {
                display: block;
                margin-bottom: 6px;
                color: #374151;
                font-size: 14px;
                font-weight: 500;
            }

            .vocaly-input {
                width: 100%;
                padding: 12px 16px;
                border: 0.5px solid #e5e7eb;
                border-radius: 8px;
                font-size: 14px;
                transition: border-color 0.2s ease, box-shadow 0.2s ease;
                outline: none;
            }

            .vocaly-input:focus {
                border-color: ${primaryColor};
                box-shadow: 0 0 0 3px ${adjustColor(primaryColor, 40, 0.1)}; /* lighter with opacity */
            }

            .vocaly-submit {
                width: 100%;
                padding: 12px 24px;
                background-color: ${primaryColor};
                color: ${textColor};
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: background-color 0.2s ease;
            }

            .vocaly-submit:hover {
                background-color: ${adjustColor(primaryColor, -10)};
            }

            .vocaly-submit:disabled {
                background-color: #9ca3af;
                cursor: not-allowed;
                transform: none;
            }

            .vocaly-success {
                display: none;
                color: #059669;
                text-align: center;
                padding: 16px;
                background-color: #ecfdf5;
                border-radius: 8px;
                margin-top: 16px;
                margin-bottom: 24px;
                font-weight: 500;
                animation: vocalyFadeIn 0.3s ease;
            }

            .vocaly-helper-text {
                font-size: 12px;
                color: #6b7280;
                margin-top: 4px;
            }

            .vocaly-powered-by {
                position: absolute;
                bottom: 16px;
                right: 32px;
                font-size: 12px;
                color: #9ca3af;
            }

            .vocaly-powered-by a {
                color: #6b7280;
                text-decoration: none;
                font-weight: 500;
                transition: color 0.2s ease;
            }

            .vocaly-powered-by a:hover {
                color: #1d4ed8;
            }

            .vocaly-label-required::after {
                content: " *";
                color: #dc2626;
            }

            .vocaly-error-message {
                display: none;
                color: #dc2626;
                background-color: #fef2f2;
                border: 1px solid #fee2e2;
                padding: 12px;
                border-radius: 6px;
                margin-bottom: 16px;
                font-size: 14px;
                animation: vocalyFadeIn 0.3s ease;
            }

            .vocaly-input.error {
                border-color: #dc2626;
            }

            .vocaly-input.error:focus {
                border-color: #dc2626;
                box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
            }

            @keyframes vocalyPulse {
                0% {
                    box-shadow: 0 0 0 0 rgba(26, 94, 255, 0.4);
                }
                70% {
                    box-shadow: 0 0 0 20px rgba(26, 94, 255, 0);
                }
                100% {
                    box-shadow: 0 0 0 0 rgba(26, 94, 255, 0);
                }
            }
        `;
        document.head.appendChild(style);

        // Helper function to adjust color brightness
        function adjustColor(color, percent, opacity = 1) {
            // Convert hex to RGB
            let R = parseInt(color.substring(1,3),16);
            let G = parseInt(color.substring(3,5),16);
            let B = parseInt(color.substring(5,7),16);

            // Adjust brightness
            R = parseInt(R * (100 + percent) / 100);
            G = parseInt(G * (100 + percent) / 100);
            B = parseInt(B * (100 + percent) / 100);

            R = (R < 255) ? R : 255;
            G = (G < 255) ? G : 255;
            B = (B < 255) ? B : 255;

            R = (R > 0) ? R : 0;
            G = (G > 0) ? G : 0;
            B = (B > 0) ? B : 0;

            const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
            const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
            const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

            if (opacity === 1) {
                return "#" + RR + GG + BB;
            } else {
                return `rgba(${R}, ${G}, ${B}, ${opacity})`;
            }
        }

        // Add method to create modal trigger
        function createModalTrigger(element, settings = {}) {
            const modalId = `vocaly-modal-${++modalCounter}`;
            const fields = settings.formFields || formFields;
            console.log("fields", fields)
            
            // Generate form fields HTML
            const formFieldsHtml = fields.map(field => `
                <div class="vocaly-form-group">
                    <label class="vocaly-label ${field.required ? 'vocaly-label-required' : ''}" for="vocaly-${field.name}-${modalId}">
                        ${field.displayTitle}
                    </label>
                    <input 
                        class="vocaly-input" 
                        type="${field.type}" 
                        id="vocaly-${field.name}-${modalId}" 
                        name="${field.name}" 
                        placeholder="${field.placeholder}"
                        ${field.required ? 'required' : ''}
                    >
                    ${field.description ? `<div class="vocaly-helper-text">${field.description}</div>` : ''}
                </div>
            `).join('');

            const modalHtml = `
                <div class="vocaly-modal" id="${modalId}">
                    <div class="vocaly-modal-content">
                        <button class="vocaly-close">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h2 class="vocaly-title">Book a call with our assistant</h2>
                        <form id="vocalyForm-${modalId}">
                            <div class="vocaly-error-message"></div>
                            ${formFieldsHtml}
                            <button type="submit" class="vocaly-submit">Request Call</button>
                        </form>
                        <div class="vocaly-success">✓ Successfully requested call!</div>
                        <div class="vocaly-powered-by">
                            Powered by <a href="https://vocalyai.com" target="_blank">Vocaly AI</a>
                        </div>
                    </div>
                </div>
            `;

            // Add modal to body
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHtml;
            document.body.appendChild(modalContainer);

            // Set up event listeners for this modal instance
            const modal = document.getElementById(modalId);
            const form = document.getElementById(`vocalyForm-${modalId}`);
            const closeBtn = modal.querySelector('.vocaly-close');
            const submitButton = form.querySelector('.vocaly-submit');
            const successMessage = modal.querySelector('.vocaly-success');
            const phoneInput = form.querySelector('input[name="phone_number"]');

            // Add click handler to the trigger element
            element.addEventListener('click', () => {
                modal.style.display = 'block';
            });

            // Set up all other event listeners for this modal instance
            setupModalEventListeners(modal, form, closeBtn, submitButton, successMessage, phoneInput, settings);
        }

        // Function to set up event listeners for a modal instance
        function setupModalEventListeners(modal, form, closeBtn, submitButton, successMessage, phoneInput, settings = {}) {
            // Close button handler
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                successMessage.style.display = 'none';
                form.reset();
            });

            // Click outside modal handler
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    successMessage.style.display = 'none';
                    form.reset();
                }
            });

            // Phone input formatting
            setupPhoneInput(phoneInput);

            // Form validation and submission
            setupFormValidation(form, submitButton, successMessage, modal, settings);
        }

        // Setup phone input formatting
        function setupPhoneInput(phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                value = value.substring(0, 10);
                
                let formattedValue = '';
                if (value.length > 0) {
                    formattedValue = '(' + value.substring(0, 3);
                    if (value.length > 3) {
                        formattedValue += ') ' + value.substring(3, 6);
                        if (value.length > 6) {
                            formattedValue += '-' + value.substring(6);
                        }
                    }
                }
                
                e.target.value = formattedValue;
            });

            phoneInput.addEventListener('keypress', function(e) {
                if (!/^\d$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                    e.preventDefault();
                }
            });

            phoneInput.addEventListener('paste', function(e) {
                e.preventDefault();
                let pastedText = (e.clipboardData || window.clipboardData).getData('text');
                let numericValue = pastedText.replace(/\D/g, '').substring(0, 10);
                
                this.value = numericValue;
                this.dispatchEvent(new Event('input'));
            });
        }

        // Setup form validation and submission
        function setupFormValidation(form, submitButton, successMessage, modal, settings = {}) {
            function validateEmail(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            }

            function validatePhone(phone) {
                return phone.replace(/\D/g, '').length === 10;
            }

            function showError(message) {
                const errorDiv = form.querySelector('.vocaly-error-message');
                errorDiv.textContent = message;
                errorDiv.style.display = 'block';
            }

            function hideError() {
                const errorDiv = form.querySelector('.vocaly-error-message');
                errorDiv.style.display = 'none';
                form.querySelectorAll('.vocaly-input').forEach(input => {
                    input.classList.remove('error');
                });
            }

            function validateForm(form, fields) {
                hideError();
                
                for (const field of fields) {
                    const value = form[field.name].value.trim();
                    
                    if (field.required && !value) {
                        form[field.name].classList.add('error');
                        showError(`Please enter your ${field.displayTitle.toLowerCase()}`);
                        return false;
                    }

                    if (field.type === 'email' && value && !validateEmail(value)) {
                        form[field.name].classList.add('error');
                        showError('Please enter a valid email address');
                        return false;
                    }

                    if (field.name === 'phone_number' && !validatePhone(value)) {
                        form[field.name].classList.add('error');
                        showError('Please enter a valid 10-digit phone number');
                        return false;
                    }
                }

                return true;
            }

            // Hide error on input
            form.querySelectorAll('.vocaly-input').forEach(input => {
                input.addEventListener('input', () => {
                    hideError();
                });
            });

            // Form submission
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                if (!validateForm(form, settings.formFields || formFields)) {
                    return;
                }

                submitButton.disabled = true;

                // Collect all form data
                const formData = settings.formFields.reduce((acc, field) => {
                    acc[field.name] = form[field.name].value;
                    return acc;
                }, {});

                try {
                    const variables = { ...formData };
                    delete variables.phone_number; // Remove phone number from variables

                    const requestSettings = {
                        "audioSettings": settings.audioSettings || audioSettings,
                        "transcriberSettings": {
                            "Language": settings.language || language
                        }
                    };

                    const response = await fetch(`${serverUrl}/api/v1/agent/${agentId}/test`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-API-Key": apiKey,
                        },
                        body: JSON.stringify({
                            toPhoneNumber: formData.phone_number,
                            fromPhoneNumber: fromNumber,
                            variables,
                            settings: requestSettings,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    form.reset();
                    successMessage.style.display = 'block';
                    setTimeout(() => {
                        modal.style.display = 'none';
                        successMessage.style.display = 'none';
                    }, 3000);

                } catch (error) {
                    console.error('Failed to submit form:', error);
                    alert('Failed to submit form. Please try again.');
                } finally {
                    submitButton.disabled = false;
                }
            });
        }

        // Create the default floating button if enabled
        if (config.showFloatingButton !== false) {
            const floatingButtonHtml = `
                <button class="vocaly-widget-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02c-.37-1.11-.56-2.3-.56-3.53c0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99C3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                    </svg>
                </button>
            `;
            const floatingButton = document.createElement('div');
            floatingButton.innerHTML = floatingButtonHtml;
            document.body.appendChild(floatingButton);
            createModalTrigger(floatingButton.querySelector('.vocaly-widget-button'));
        }

        // Return public methods
        return {
            openModal: (elementSelector, customSettings = {}) => {
                if (customSettings.formFields && !validateFormFields(customSettings.formFields)) {
                    return;
                }

                const elements = document.querySelectorAll(elementSelector);
                elements.forEach(element => {
                    const modalSettings = {
                        ...customSettings,
                        audioSettings: customSettings.audioSettings || audioSettings,
                        language: customSettings.language || language,
                        formFields: customSettings.formFields || formFields,
                        apiKey: customSettings.apiKey || apiKey,
                        agentId: customSettings.agentId || agentId,
                        fromNumber: customSettings.fromNumber || fromNumber,
                        primaryColor: customSettings.primaryColor || primaryColor,
                        textColor: customSettings.textColor || textColor,
                    };
                    createModalTrigger(element, modalSettings);
                });
            }
        };
    }

    // Return public API
    return {
        init: createWidget
    };
})(); 