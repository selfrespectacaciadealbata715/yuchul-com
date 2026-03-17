'use client';

import { useState, useEffect } from 'react';
import { Search, Mail } from 'lucide-react';
import type { ScanInput } from '@/lib/types';

const ScanForm = ({ onSubmit, isLoading, buttonText, initialData }) => {
  const [formData, setFormData] = useState<ScanInput>({
    name: '',
    email: '',
    phone: '',
    username: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email) onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
    </form>
  );
};
