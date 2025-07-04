export interface IOnboarding {
  name: string;
  isCompleted: boolean;
}

export type OnboardingDto = {
  name: string;
  is_completed: number; // 0 or 1
}

export type OnboardingScreen = {
  id: string;
  illustration: any; // Image source, can be a local image or remote URL
  title: string;
  text: string;
}

export type OnboardingConfig = {
  name: string;
  screens: OnboardingScreen[];
}
