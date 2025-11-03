'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs'; // Import useAuth
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';

export function FooterContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { getToken } = useAuth(); // Get the token function

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');

    try {
      // Get auth token (it will be null if logged out)
      const token = await getToken();
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
         throw new Error("API URL not configured.");
      }

      const response = await fetch(`${apiUrl}/feedback`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ name, email, phone, message }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to send message.');
      }

      // Success
      setStatus('Response received! Thank you for your feedback!');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setTimeout(() => setStatus(''), 4000);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setStatus(err.message);
      } else {
        setStatus('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="footer-name" className="text-neutral-300">Name</Label>
        <Input
          type="text"
          id="footer-name"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-2 bg-neutral-800 border-neutral-700 text-white"
        />
      </div>
      <div>
        <Label htmlFor="footer-email" className="text-neutral-300">Email</Label>
        <Input
          type="email"
          id="footer-email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-2 bg-neutral-800 border-neutral-700 text-white"
        />
      </div>
       <div>
        <Label htmlFor="footer-phone" className="text-neutral-300">Phone <span className="text-neutral-500">(Optional)</span></Label>
        <Input
          type="tel"
          id="footer-phone"
          placeholder="Your Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-2 bg-neutral-800 border-neutral-700 text-white"
        />
      </div>
      <div>
        <Label htmlFor="footer-message" className="text-neutral-300">Review or Question</Label>
        <Textarea
          id="footer-message"
          placeholder="Your suggestions or questions..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="mt-2 bg-neutral-800 border-neutral-700 text-white"
          rows={3}
        />
      </div>
      <div className="flex justify-between items-center">
        {status ? (
          <p className={`text-sm ${status.includes('Thank') ? 'text-green-400' : 'text-red-400'}`}>
            {status}
          </p>
        ) : (
          <span />
        )}
        <Button 
          type="submit" 
          className="bg-white text-gray-900 hover:bg-gray-200"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </div>
    </form>
  );
}