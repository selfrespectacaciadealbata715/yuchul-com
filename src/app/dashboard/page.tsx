'use client';

import { useEffect, useState } from 'react';
import { useAppStore, hydrateStore } from 'A/lib/store';
import DashboardLayout from '@/components/DashboardLayout';
import RiskGauge from '@/components/RiskGauge';
import Link from 'next/link';
import { TrendingUp, AlertCircle, CheckCircle, Clock, Search, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const { findings, removalRequests, scanResults } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    hydrateStore();
    setMounted(true);
  }, []);

  const riskScore = scanResults?.riskScore ?? (findings.length > 0 ? 72 : 0);
  const totalBreaches = findings.length;
  const removable = findings.filter((f) => f.status === 'new').length;
  const inQueue = remo