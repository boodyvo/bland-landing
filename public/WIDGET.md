# Vocaly Widget Documentation

## Overview
The Vocaly Widget is a customizable JavaScript widget that allows you to easily integrate AI call booking functionality into any website. The widget provides a floating button and/or custom trigger elements that open a modal form for scheduling calls.

## Installation

### 1. Include the Script
Add the widget script to your HTML file:
```html
<script src="https://cdn.vocalyai.com/js/widgets/widget.js" />
```

### 2. Initialize the Widget
Initialize the widget with your configuration:
```javascript
const widget = VocalyWidget.init({
    apiKey: 'your-api-key',
    agentId: 'your-agent-id',
    fromNumber: '+1234567890',
    // ... other options
});
```

## Configuration Options

### Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `apiKey` | string | Your Vocaly API key |
| `agentId` | string | The ID of the AI agent to handle calls |
| `fromNumber` | string | The phone number that will be used to make calls |

### Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `serverUrl` | string | 'https://api.vocalyai.com' | API server URL |
| `primaryColor` | string | '#1a5eff' | Primary color for buttons and accents |
| `textColor` | string | '#ffffff' | Text color for buttons |
| `showFloatingButton` | boolean | true | Whether to show the floating call button |
| `audioSettings` | object | `{ VoiceID: "TcFVFGKruwp5AI74cZL1" }` | Voice settings for the call |
| `language` | string | 'en' | Language for transcription |
| `formFields` | array | [see below] | Form fields configuration |

### Form Fields Configuration

Each form field can be configured with the following properties:
```javascript
{
    name: string,          // Field name for form submission
    displayTitle: string,  // Label shown to user
    type: string,         // HTML input type (text, email, tel, etc.)
    placeholder: string,   // Input placeholder text
    description: string,   // Helper text shown below the field
    required: boolean     // Whether the field is required
}
```

**Important Note**: The form fields configuration must always include a field with `name: 'phone_number'`. This field is required for the widget to function properly.

Default form fields:
```javascript
[
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
        name: 'phone_number',  // This field is required
        displayTitle: 'Phone Number',
        type: 'tel',
        placeholder: '(555) 000-0000',
        description: "The number we'll call you on",
        required: true
    }
]
```

## Methods

### init(config)
Initializes the widget with the provided configuration.
```javascript
const widget = VocalyWidget.init({
    apiKey: 'your-api-key',
    agentId: 'your-agent-id',
    fromNumber: '+1234567890'
});
```

### openModal(selector, settings?)
Attaches the widget modal to elements matching the provided selector.
```javascript
widget.openModal('.book-call-button');
// or with custom settings
widget.openModal('.custom-button', {
    language: 'es',
    formFields: [...],
    // other settings
});
```

## Usage Examples

### Basic Implementation
```html
<script src="widget.js"></script>
<script>
    VocalyWidget.init({
        apiKey: 'your-api-key',
        agentId: 'your-agent-id',
        fromNumber: '+1234567890'
    });
</script>
```

### Custom Trigger Elements
```html
<button class="my-custom-button">Book a Call</button>

<script>
    const widget = VocalyWidget.init({
        apiKey: 'your-api-key',
        agentId: 'your-agent-id',
        fromNumber: '+1234567890'
    });

    widget.openModal('.my-custom-button');
</script>
```

### Multiple Languages Example
```javascript
// English configuration (default)
widget.openModal('.english-button');

// Spanish configuration
widget.openModal('.spanish-button', {
    language: 'es',
    audioSettings: {
        VoiceID: "spanish-voice-id"
    },
    formFields: [
        {
            name: 'name',
            displayTitle: 'Nombre',
            type: 'text',
            placeholder: 'Ingrese su nombre',
            description: 'Cómo se dirigirá nuestro asistente a usted',
            required: true
        },
        // ... other fields
    ]
});
```

### Custom Fields Example
```javascript
widget.openModal('.custom-button', {
    formFields: [
        {
            name: 'phone_number',
            displayTitle: 'Phone',
            type: 'tel',
            placeholder: '(555) 000-0000',
            description: 'Your contact number',
            required: true
        },
        {
            name: 'company',
            displayTitle: 'Company',
            type: 'text',
            placeholder: 'Your company name',
            description: 'Help us prepare for the call',
            required: false
        },
        {
            name: 'preferred_time',
            displayTitle: 'Preferred Time',
            type: 'time',
            placeholder: '13:00',
            description: 'When should we call you?',
            required: false
        }
    ]
});
```

### Different Agent Configuration
```javascript
widget.openModal('.enterprise-button', {
    apiKey: 'different-api-key',
    agentId: 'enterprise-agent-id',
    fromNumber: '+1987654321',
    primaryColor: '#10b981',
    audioSettings: {
        VoiceID: "enterprise-voice-id"
    },
    language: "multi"
});
```

## Styling

### CSS Classes
The widget provides several CSS classes for styling:

| Class Name | Description |
|------------|-------------|
| `vocaly-widget-button` | The floating call button |
| `vocaly-modal` | The modal container |
| `vocaly-modal-content` | The modal content wrapper |
| `vocaly-title` | The modal title |
| `vocaly-form-group` | Form field container |
| `vocaly-label` | Form field labels |
| `vocaly-input` | Form input fields |
| `vocaly-helper-text` | Helper text below inputs |
| `vocaly-submit` | Submit button |
| `vocaly-close` | Close button |
| `vocaly-success` | Success message |
| `vocaly-error-message` | Error message |
| `vocaly-powered-by` | Powered by text |

### Animations
The widget includes several built-in animations:
- Modal fade in/out
- Success message fade
- Button hover effects
- Phone icon pulse effect

## Features
- 📱 Responsive design
- 🎨 Customizable styling
- 🌍 Multi-language support
- 📝 Configurable form fields
- 🔄 Phone number formatting
- ⚡ Form validation
- 🎯 Multiple trigger options
- 🔒 Error handling
- ✨ Success animations

## Browser Support
The widget is compatible with all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Error Handling
The widget includes built-in error handling for:
- Required field validation
- Email format validation
- Phone number format validation
- API call failures
- Network errors

## Notes
- Phone numbers are automatically formatted as (xxx) xxx-xxxx
- All API calls include proper error handling
- The widget maintains accessibility standards
- Modal can be closed by clicking outside or using the close button
- Success messages automatically disappear after 3 seconds
- The widget is fully responsive and works on all device sizes
- All text content can be customized through the formFields configuration
- Multiple instances of the widget can be used on the same page
- The widget automatically handles form reset after submission

## Security
- API keys are never exposed in the DOM
- All API calls use HTTPS
- Form submissions are protected against double-submission
- Input data is sanitized before submission

## Support
For additional support or questions, contact:
- Email: hi@vocalyai.com
- Website: https://vocalyai.com

