import { IOnboarding, OnboardingConfig, OnboardingDto } from "./@types";
import { InitialOnboarding } from "./screens";

export const ONBOARDING_CONFIG: OnboardingConfig[] = [
  InitialOnboarding
];

export class Onboarding implements IOnboarding {
  name: string;
  isCompleted: boolean;

  constructor(name: string, isCompleted: boolean) {
    this.name = name;
    this.isCompleted = isCompleted;
  }

  static fromDto(dto: OnboardingDto): Onboarding {
    return new Onboarding(dto.name, dto.is_completed === 1);
  }

  toDto(): OnboardingDto {
    return {
      name: this.name,
      is_completed: this.isCompleted ? 1 : 0,
    };
  }

  getOnboardingConfig(): OnboardingConfig | undefined {
    return ONBOARDING_CONFIG.find(config => config.name === this.name);
  }
}
