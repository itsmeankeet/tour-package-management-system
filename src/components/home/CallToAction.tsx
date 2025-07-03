import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction: React.FC = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">
          Don't Just Dream It, Book It
        </h2>
        <div className="w-24 h-1 bg-green-600 mx-auto mt-2 rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl p-10 text-center">
        <p className="text-gray-700 text-lg mb-6">
          Join thousands of explorers discovering beautiful destinations.
          Sign in to unlock personalized tours and special offers.
        </p>
        <Link to="/auth">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium shadow-md transition">
            Login Now
          </button>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;