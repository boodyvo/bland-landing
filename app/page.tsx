'use client'

import { useState } from 'react';

const serverUrl = 'http://localhost:8080/api/v1/form';

export default function Home() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: ''
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/v1/form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('Form submitted successfully');
            // Handle success
        } catch (error) {
            console.error('Failed to submit form:', error);
            // Handle errors
        }
    };

    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
          <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
              <div className="mb-5">
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Name</label>
                  <input type="text" id="name" name="name" onChange={handleChange} value={formData.name} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />

                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">How assistant can name you during the call.</p>
              </div>
              <div className="mb-5">
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
                  <input type="email" id="email" name="email" onChange={handleChange} value={formData.email} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />

                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">We’ll send you a transcription of the call to the email.</p>
              </div>
              <div className="mb-5">
                  <label htmlFor="phone_number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Phone Number</label>
                  <input type="tel" id="phone_number" name="phone_number" onChange={handleChange} value={formData.phone_number} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />

                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">We’ll call you back to this number.</p>
              </div>

              <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
          </form>
      </main>
    );
}
