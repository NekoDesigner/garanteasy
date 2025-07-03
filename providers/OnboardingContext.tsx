import React, { createContext, useContext, useEffect, useState } from 'react';
import { Onboarding } from '../constants/Onboardings';
import { useOnboardingRepository } from '../hooks/useOnboardingRepository/useOnboardingRepository';

interface OnboardingContextType {
  currentOnboarding: Onboarding | null;
  isLoading: boolean;
  refreshOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [currentOnboarding, setCurrentOnboarding] = useState<Onboarding | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getMostRecentOnboarding } = useOnboardingRepository();

  const refreshOnboarding = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const onboarding = await getMostRecentOnboarding();
      setCurrentOnboarding(onboarding);
    } catch (error) {
      console.error('Error fetching onboarding:', error);
      setCurrentOnboarding(null);
    } finally {
      setIsLoading(false);
    }
  }, [getMostRecentOnboarding]);

  useEffect(() => {
    refreshOnboarding();
  }, [refreshOnboarding]);

  const value: OnboardingContextType = {
    currentOnboarding,
    isLoading,
    refreshOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingContext(): OnboardingContextType {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboardingContext must be used within an OnboardingProvider');
  }
  return context;
}
