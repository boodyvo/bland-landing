import { redirect } from 'next/navigation';

export default function DemoPage() {
    // Redirect to the static HTML page
    redirect('/demo.html');
} 