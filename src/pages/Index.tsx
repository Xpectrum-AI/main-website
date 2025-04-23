import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-warm-gradient flex flex-col index-page">
      <Navbar />
      <main>
        <HeroSection />
      </main>
    </div>
  );
};

export default Index;
