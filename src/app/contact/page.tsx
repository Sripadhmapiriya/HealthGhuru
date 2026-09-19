import { Metadata } from 'next';
import { ContactClient } from './ContactClient';
import { HealthDisclaimer } from '@/components/media/HealthDisclaimer';

export const metadata: Metadata = {
  title: 'Contact Us | HealthGhuru — Reach Out for Medical Queries & Sponsorships',
  description: 'Get in touch with the HealthGhuru team for inquiries, health feedback, advertisement requests, or clinical editorial corrections.',
};

export default function ContactPage() {
  return (
    <div className="w-full bg-[#f8fafc] min-h-screen py-10 sm:py-16">
      <div className="site-container px-4 sm:px-6 lg:px-8 space-y-12">
        <ContactClient />
        <HealthDisclaimer />
      </div>
    </div>
  );
}
