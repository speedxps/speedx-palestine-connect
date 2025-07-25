import React, { useState } from 'react';
import { Button } from './button';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const [isArabic, setIsArabic] = useState(true);

  const toggleLanguage = () => {
    setIsArabic(!isArabic);
    document.documentElement.dir = isArabic ? 'ltr' : 'rtl';
    document.documentElement.lang = isArabic ? 'en' : 'ar';
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
    >
      <Globe className="h-4 w-4" />
      {isArabic ? 'English' : 'العربية'}
    </Button>
  );
};