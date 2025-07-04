import { OnboardingConfig } from "../../@types";

export const InitialOnboarding: OnboardingConfig = {
  name: 'initial_onboarding',
  screens: [
    {
      id: 'welcome',
      illustration: require('../../../../assets/images/initial_onboarding_welcome.png'),
      title: "Bienvenu sur \nGarantEasy 👋",
      text: "Votre coffre-fort numérique pour centraliser, sécuriser et suivre toutes vos garanties"
    },
    {
      id: 'main_features',
      illustration: require('../../../../assets/images/initial_onboarding_main_features.png'),
      title: "Ajoutez vos garanties facilement",
      text: "Scannez vos tickets de caisse ou contrats de garantie, ou importez une photo / fichier depuis votre téléphone"
    },
    {
      id: 'notification_features',
      illustration: require('../../../../assets/images/initial_onboarding_notification_features.png'),
      title: "Soyez alerté avant l’expiration",
      text: "Recevez une notification lorsque l’une de vos garanties approche de sa date d’expiration. Vous avez toujours un coup d’avance"
    },
    {
      id: 'last_screen',
      illustration: require('../../../../assets/images/initial_onboarding_last_screen.png'),
      title: "Un coffre-fort numérique à porté de main",
      text: "Toutes vos garanties sont stockées de manière sécurisée dans l’application, accessibles à tout moment"
    }
  ]
};
