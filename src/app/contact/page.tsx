import { Metadata } from 'next';
import { ContactClient } from './ContactClient';
import { HealthDisclaimer } from '@/components/media/HealthDisclaimer';

export const metadata: Metadata = {
  title: 'Contact Us | HealthGhuru — Reach Out for Medical Queries & Sponsorships',
  description: 'Get in touch with the HealthGhuru team for inquiries, health feedback, advertisement requests, or clinical editorial corrections.',
};

export default function ContactPage() {
  return (
    <div className="w-full bg-[#f8fafc] min-h-screen">
      <ContactClient />
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <HealthDisclaimer />
      </div>
    </div>
  );
}
