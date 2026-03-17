'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { supabase, signInWithGoogle, canScan, recordScan } from '@/lib/supabase';
import ScanForm from '@/components/ScanForm';
import FindingCard from 'A/components/FindingCard';
import LoadingWithAd from 'A/components/LoadingWithAd';
import { ArrowLeft, Lock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import type { ScanInput } from '@/lib/types';
import type { User } from '@supabase/supabase-js';

o