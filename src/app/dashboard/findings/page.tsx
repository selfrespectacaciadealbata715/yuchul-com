'use client';

import { useState, useEffect } from 'react';
import { useAppStore, hydrateStore } from 'A/lib/store';
import DashboardLayout from '@/components/DashboardLayout';
import FindingCard from 'A/components/FindingCard';
import type { BreachSource } from 'A/lib/types';