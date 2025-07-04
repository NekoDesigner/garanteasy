import { useRouter } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Animated, Dimensions, PanResponder } from 'react-native';
import OnboardingScreenStep from '../components/OnboardingNavigation/OnboardingScreenStep';
import { COLORS } from '../constants';
import { OnboardingConfig } from '../constants/Onboardings';
import { useOnboardingRepository } from '../hooks/useOnboardingRepository/useOnboardingRepository';
import { useOnboardingContext } from '../providers/OnboardingContext';

/**
 * TODO:
 * - [ ] Générer la liste des écrans d'onboarding à partir de la configuration
 * - [ ] Ajouter un stepper et les boutons pour naviguer entre les écrans
 * - [ ] Ajouter un bouton pour marquer l'onboarding comme terminé
 * - [ ] Ajouter une logique pour rediriger l'utilisateur vers la page d'accueil après
 */

const OnboardingScreen = () => {
  const router = useRouter();
  const { currentOnboarding, refreshOnboarding } = useOnboardingContext();
  const { markOnboardingAsCompleted } = useOnboardingRepository();  const [onboardingConfig, setOnboardingConfig] = React.useState<OnboardingConfig | undefined>();
  const [currentScreenIndex, setCurrentScreenIndex] = React.useState(0);
  const [slideAnimation] = React.useState(new Animated.Value(0));
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [panAnimation] = React.useState(new Animated.Value(0));

  const screenWidth = Dimensions.get('window').width;
  const swipeThreshold = screenWidth * 0.25; // 25% de l'écran

  const handleNextSwipe = React.useCallback(() => {
    if (isAnimating || !onboardingConfig || currentScreenIndex >= onboardingConfig.screens.length - 1) {
      return;
    }

    setIsAnimating(true);

    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: currentScreenIndex + 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(panAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentScreenIndex(currentScreenIndex + 1);
      setIsAnimating(false);
    });
  }, [isAnimating, onboardingConfig, currentScreenIndex, slideAnimation, panAnimation]);

  const handlePreviousSwipe = React.useCallback(() => {
    if (isAnimating || currentScreenIndex <= 0) {
      return;
    }

    setIsAnimating(true);

    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: currentScreenIndex - 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(panAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentScreenIndex(currentScreenIndex - 1);
      setIsAnimating(false);
    });
  }, [isAnimating, currentScreenIndex, slideAnimation, panAnimation]);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 50;
        },
        onPanResponderGrant: () => {
          if (!isAnimating) {
            panAnimation.setValue(0);
          }
        },
        onPanResponderMove: (_, gestureState) => {
          if (!isAnimating) {
            panAnimation.setValue(gestureState.dx);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (isAnimating) return;

          const { dx, vx } = gestureState;
          const shouldChangeScreen = Math.abs(dx) > swipeThreshold || Math.abs(vx) > 0.3;

          if (shouldChangeScreen) {
            if (dx > 0 && currentScreenIndex > 0) {
              // Swipe vers la droite - écran précédent
              handlePreviousSwipe();
            } else if (dx < 0 && onboardingConfig && currentScreenIndex < onboardingConfig.screens.length - 1) {
              // Swipe vers la gauche - écran suivant (sauf sur le dernier écran)
              const isLastScreen = currentScreenIndex === onboardingConfig.screens.length - 1;
              if (!isLastScreen) {
                handleNextSwipe();
              } else {
                // Animation de rebond pour le dernier écran
                Animated.spring(panAnimation, {
                  toValue: 0,
                  useNativeDriver: true,
                }).start();
              }
            } else {
              // Animation de retour
              Animated.spring(panAnimation, {
                toValue: 0,
                useNativeDriver: true,
              }).start();
            }
          } else {
            // Animation de retour
            Animated.spring(panAnimation, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [isAnimating, currentScreenIndex, onboardingConfig, panAnimation, swipeThreshold, handleNextSwipe, handlePreviousSwipe]
  );  const handleNext = () => {
    if (isAnimating || !onboardingConfig || currentScreenIndex >= onboardingConfig.screens.length - 1) {
      return;
    }

    setIsAnimating(true);

    Animated.timing(slideAnimation, {
      toValue: currentScreenIndex + 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentScreenIndex(currentScreenIndex + 1);
      setIsAnimating(false);
    });
  };

  const handlePrevious = () => {
    if (isAnimating || currentScreenIndex <= 0) {
      return;
    }

    setIsAnimating(true);

    Animated.timing(slideAnimation, {
      toValue: currentScreenIndex - 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentScreenIndex(currentScreenIndex - 1);
      setIsAnimating(false);
    });
  };

  const handleCompleteOnboarding = async () => {
    if (currentOnboarding && !isAnimating) {
      try {
        setIsAnimating(true); // Prevent multiple clicks
        await markOnboardingAsCompleted(currentOnboarding.name);
        await refreshOnboarding();
        (router as any).replace('/');
      } catch (error) {
        console.error('Error completing onboarding:', error);
        setIsAnimating(false); // Reset on error
      }
    }
  };

  React.useEffect(() => {
    setOnboardingConfig(currentOnboarding?.getOnboardingConfig());
    const newIndex = 0;
    setCurrentScreenIndex(newIndex);
    slideAnimation.setValue(newIndex);
    panAnimation.setValue(0);
    setIsAnimating(false);
  }, [currentOnboarding, slideAnimation, panAnimation]);

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer} {...panResponder.panHandlers}>
        {onboardingConfig?.screens.map((screen, index) => {
          const translateX = Animated.add(
            slideAnimation.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [Dimensions.get('window').width, 0, -Dimensions.get('window').width],
              extrapolate: 'clamp',
            }),
            panAnimation
          );

          return (
            <Animated.View
              key={screen.id}
              style={[
                styles.absoluteScreen,
                {
                  transform: [{ translateX }],
                }
              ]}
            >
              <OnboardingScreenStep
                title={screen.title}
                text={screen.text}
                illustration={screen.illustration}
                id={screen.id}
                isVisible={true}
                onNext={handleNext}
                onPrev={handlePrevious}
                onValidate={handleCompleteOnboarding}
                isFirstScreen={index === 0}
                isLastScreen={index === (onboardingConfig?.screens.length || 1) - 1}
                isAnimating={isAnimating}
                showProgress={true}
                currentIndex={index}
                totalScreens={onboardingConfig?.screens.length || 1}
                isCurrentScreen={index === currentScreenIndex}
              />
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blueDarker
  },
  screenContainer: {
    flex: 1,
  },
  absoluteScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default OnboardingScreen;