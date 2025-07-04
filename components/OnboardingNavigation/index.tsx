import { useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { useOnboardingContext } from '../../providers/OnboardingContext';

interface OnboardingNavigationProps {
  children: React.ReactNode;
}

export function OnboardingNavigation({ children }: OnboardingNavigationProps) {
  const { currentOnboarding, isLoading } = useOnboardingContext();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) {
      return; // Wait for onboarding data to load
    }

    const currentPath = segments.join('/');
    const isOnOnboardingScreen = currentPath === 'onboarding' || segments.some(segment => segment === 'onboarding');

    // If there's an active onboarding and user is not on onboarding screen, redirect
    if (currentOnboarding && !currentOnboarding.isCompleted && !isOnOnboardingScreen) {
      router.push('/onboarding');
      return;
    }

    // If there's no active onboarding and user is on onboarding screen, redirect to home
    if ((!currentOnboarding || currentOnboarding.isCompleted) && isOnOnboardingScreen) {
      router.replace('/');
      return;
    }
  }, [currentOnboarding, isLoading, segments, router]);

  return <>{children}</>;
}
