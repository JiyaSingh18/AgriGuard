import React, { useState, useEffect } from 'react';
import { Menu, X, Leaf } from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-forest-700 shadow-md' : 'bg-forest-800'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Leaf className="h-8 w-8 text-sage-200" />
          <h1 className="text-2xl font-bold text-white">AgriGuard</h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {['Home', 'Features', 'About', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-sage-100 hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
          <button className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
            Sign Up
          </button>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-sage-100 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-forest-800 py-4 px-4 border-t border-forest-600 animate-fadeIn">
          <nav className="flex flex-col space-y-4">
            {['Home', 'Features', 'About', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-sage-100 hover:text-white transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <button className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors w-full">
              Sign Up
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;