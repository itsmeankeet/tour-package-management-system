import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface WelcomeProps {
  userName: string;
}

const Welcome: React.FC<WelcomeProps> = ({ userName }) => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome back, {userName}! 🌟
            </h2>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              We're your trusted travel partner, offering carefully curated
              tour packages to the world's most amazing destinations. From
              adventure treks to luxury getaways, we help you create
              memories that last a lifetime.
            </p>
            <div className="mt-6">
              <Link to="/dashboard">
                <Button className="bg-green-600 hover:bg-green-700">
                  View My Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Welcome;