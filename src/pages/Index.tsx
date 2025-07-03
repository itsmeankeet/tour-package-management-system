import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Welcome from '@/components/home/Welcome';
import FeaturedPackages from '@/components/home/FeaturedPackages';
import CallToAction from '@/components/home/CallToAction';
import Footer from '@/components/home/Footer';

interface Package {
  id: string;
  title: string;
  location: string;
  description: string;
  price: number;
  duration: string;
  image_url?: string;
}


const Index = () => {
  const { user, profile, isAdmin } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  // instant chage haru dekhauna
  useEffect(() => {
    fetchFeaturedPackages();
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  // features haru fetch gareko using supabase query
  const fetchFeaturedPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .limit(6)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('package_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(data?.map((f) => f.package_id) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };


  const handleSearch = (query: string) => {
    window.location.href = `/packages?search=${encodeURIComponent(query)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSearch={handleSearch} /> 
      <Hero isLoggedIn={!!user} />

      {user && !isAdmin && (
        <Welcome userName={profile?.name || 'Guest'} />
      )}

      {!isAdmin && <Features />}

      <FeaturedPackages
      // bhako sab package
        packages={packages}
        loading={loading}
        // user  sanga bhako favorite package haru dekhaun
        favorites={favorites}
        onFavoriteChange={fetchFavorites}
      />
      {/* {if user is not logged in then show call to action button} */}
      {!user && <CallToAction />}
      
      <Footer />
    </div>
  );
};

export default Index;
