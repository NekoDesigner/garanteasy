import { OnboardingConfig } from "../../@types";

export const InitialOnboarding: OnboardingConfig = {
  name: 'initial_onboarding',
  screens: [
    {
      id: 'welcome',
      illustration: 'mascot',
      title: "Bienvenu sur \nGarantEasy 👋",
      text: "Votre coffre-fort numérique pour centraliser, sécuriser et suivre toutes vos garanties"
    },
    {
      id: 'main_features',
      illustration: 'scan',
      title: "Ajoutez vos garanties facilement",
      text: "Scannez vos tickets de caisse ou contrats de garantie, ou importez une photo / fichier depuis votre téléphone"
    },
    {
      id: 'notification_features',
      illustration: 'bell',
      title: "Soyez alerté avant l’expiration",
      text: "Recevez une notification lorsque l’une de vos garanties approche de sa date d’expiration. Vous avez toujours un coup d’avance"
    },
    {
      id: 'last_screen',
      illustration: 'shield',
      title: "Un coffre-fort numérique à porté de main",
      text: "Toutes vos garanties sont stockées de manière sécurisée dans l’application, accessibles à tout moment"
    }
  ]
};
