'use client';

import { useState, useEffect } from 'react';
import { useAppStore, hydrateStore } from 'A/lib/store';
import DashboardLayout from '@/components/DashboardLayout';
import { Mail, Check, Send, AlertTriangle, ExternalLink, CheckCircle } from 'lucide-react';
import { dataControllers } from '@/lib/removal-templates';
import type { Finding } from 'A/lib/types';