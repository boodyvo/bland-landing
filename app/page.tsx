'use client'

import { useState } from 'react';
import { useRouter } from 'next/router';

// const serverUrl = 'https://api.vocalyai.com/api/v1/external/demo/submit';
const serverUrl = 'http://localhost:8081/api/v1/external/demo/submit';

const validateID = (id?: string | string[] | null) => {
    if (!id) {
        return false;
    }
    if (Array.isArray(id)) {
        return false;
    }

    const uuidRegex = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');

    return uuidRegex.test(id);
}

const HomePage: React.FC = () => {
    const [disabled, setDisabled] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
    });

    if (typeof window === 'undefined') {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center py-24 px-4">
                <div>Invalid URL.</div>
                <div>Contact hi@vocalyai.com for correct link.</div>
            </main>
        )
    }

    // extract id from url
    const url = new URL(window.location.href);
    const id = url.searchParams.get('id');
    // const router = useRouter();
    // const { id } = router.query;
    // validate id is uuid
    const uuidRegex = new RegExp('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
    // if (!validateID(id)) {
    //     return (
    //         <main className="flex min-h-screen flex-col items-center justify-center py-24 px-4">
    //             <div>Invalid URL.</div>
    //             <div>Contact hi@vocalyai.com for correct link.</div>
    //         </main>
    //     )
    // }

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prevState: any) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (disabled) {
            return;
        }

        setDisabled(true);
        try {
            const variables = {
                name: formData.name,
                email: formData.email,
            }
            const settings = {
                  "audioSettings": {
                    "VoiceID": "TcFVFGKruwp5AI74cZL1"
                  },
                  "transcriberSettings": {
                    "Language": "en"
                  }
            };

            const response = await fetch("http://localhost:8081/api/v1/agent/e8fac920-6f9d-4116-9324-a738d5acdb21/test", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": `67e8df44-91a6-4f5a-9d56-fdde6be6aa59`,
                },
                body: JSON.stringify({
                    toPhoneNumber: formData.phone_number,
                    fromPhoneNumber: "+17867331773",
                    variables,
                    settings,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setFormData({
                name: '',
                email: '',
                phone_number: ''
            });
            setShowSnackbar(true);

            console.log('Form submitted successfully');
        } catch (error) {
            console.error('Failed to submit form:', error);
        } finally {
            setDisabled(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center py-24 px-4">
            <form onSubmit={handleSubmit} className="max-w-sm">
                <div className="max-w-sm mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center">Book a call with our assistant</h1>
                </div>

                <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Name</label>
                    <input type="text" id="name" name="name" onChange={handleChange} value={formData.name} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Vlad" required />

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">How assistant can name you during the call.</p>
                </div>
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
                    <input type="email" id="email" name="email" onChange={handleChange} value={formData.email} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@vocalyai.com" required />

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">We’ll send you a transcription of the call to the email.</p>
                </div>
                <div className="mb-5">
                    <label htmlFor="phone_number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Phone Number</label>
                    <input type="tel" id="phone_number" name="phone_number" onChange={handleChange} value={formData.phone_number} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="5551112233" required />

                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">We’ll call you back to this number.</p>
                </div>

                <button disabled={disabled} type="submit" className={`disabled:bg-gray-300 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${showSnackbar ? "hidden" : ""}`}>Submit</button>
                <div className={`max-w-sm w-full text-center py-4 lg:px-4 ${showSnackbar ? "" : "hidden"}`}>
                    <div className="w-full py-4 px-8 bg-green-400 items-center text-gray-700 leading-none rounded-lg flex lg:inline-flex" role="alert">
                        <span className="font-semibold mr-2 text-left flex-auto">Successfully booked a call.</span>
                    </div>
                </div>
            </form>
        </main>
    );
}


export default HomePage;