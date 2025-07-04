import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../../constants';
import Button from '../ui/Button';
import ArrowIcon from '../ui/Icons/ArrowIcon';

interface OnboardingScreenProps {
  isLast?: boolean;
  title?: string;
  text?: string;
  illustration?: any; // Replace with appropriate type for illustration
  id?: string;
  isVisible?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  onValidate?: () => void;
  isFirstScreen?: boolean;
  isLastScreen?: boolean;
  isAnimating?: boolean;
  showProgress?: boolean;
  currentIndex?: number;
  totalScreens?: number;
  isCurrentScreen?: boolean;
}

const OnboardingScreenStep: React.FC<OnboardingScreenProps> = ({
  isLast = false,
  isVisible = false,
  title,
  text,
  illustration,
  id,
  onNext,
  onPrev,
  onValidate,
  isFirstScreen = false,
  isLastScreen = false,
  isAnimating = false,
  showProgress = false,
  currentIndex = 0,
  totalScreens = 1,
  isCurrentScreen = false
}) => {
  const [illustrationScale] = React.useState(new Animated.Value(0.3));
  const [illustrationOpacity] = React.useState(new Animated.Value(0));
  const [contentOpacity] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (isCurrentScreen) {
      // Animation d'apparition avec scale et opacity
      Animated.parallel([
        Animated.spring(illustrationScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 60,
          friction: 8,
          delay: 150, // Petit délai pour que l'animation de slide soit presque terminée
        }),
        Animated.timing(illustrationOpacity, {
          toValue: 1,
          duration: 400,
          delay: 150,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 300,
          delay: 200, // Légèrement après l'illustration
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Reset le scale et l'opacity pour les écrans non visibles
      illustrationScale.setValue(0.3);
      illustrationOpacity.setValue(0);
      contentOpacity.setValue(0);
    }
  }, [isCurrentScreen, illustrationScale, illustrationOpacity, contentOpacity]);
  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.illustrationContainer}>
        <Animated.Image
          source={illustration}
          style={[
            styles.illustration,
            {
              transform: [{ scale: illustrationScale }],
              opacity: illustrationOpacity
            }
          ]}
          resizeMode="contain"
          loadingIndicatorSource={undefined}
          fadeDuration={0}
        />
      </View>

      <View style={styles.contentContainer}>
        <Animated.View style={{ opacity: contentOpacity }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>
            {text}
          </Text>
        </Animated.View>

        {/* Progress indicator */}
        <Animated.View style={{ opacity: contentOpacity }}>
          {showProgress && totalScreens > 1 && (
            <View style={styles.progressContainer}>
              {Array.from({ length: totalScreens }, (_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressDot,
                    index === currentIndex && styles.progressDotActive
                  ]}
                />
              ))}
            </View>
          )}
        </Animated.View>

        {/* Navigation Buttons */}
        <Animated.View style={{ opacity: contentOpacity }}>
          <View style={styles.navigationContainer}>
            <View style={styles.buttonRow}>
              {!isFirstScreen && !isLastScreen && (
                <Button
                  label="Précédent"
                  onPress={onPrev}
                  variant="link-primary"
                  size="s"
                  style={styles.navButton}
                  disabled={isAnimating}
                  showIcon
                  iconPosition='left'
                  icon={<ArrowIcon style={{ transform: [{ rotateY: '180deg' }] }} />}
                />
              )}

              {isFirstScreen && <View style={styles.navButton} />}

              {!isLastScreen && <View style={styles.spacer} />}

              {isLastScreen ? (
                <Button
                  label="Continuer"
                  onPress={onValidate}
                  variant="secondary"
                  size="s"
                  style={[styles.navButton, { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 14 }]}
                  disabled={isAnimating}
                />
              ) : (
                <Button
                  label="Suivant"
                  onPress={onNext}
                  variant="primary"
                  size="s"
                  style={styles.navButton}
                    disabled={isAnimating}
                    showIcon
                    iconPosition='right'
                  icon={<ArrowIcon />}
                />
              )}
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blueDarker,
  },
  illustrationContainer: {
    flex: 0.55,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  illustration: {
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  contentContainer: {
    flex: 0.45,
    backgroundColor: COLORS.light,
    paddingVertical: 40,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  navigationContainer: {
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    minWidth: 100,
  },
  spacer: {
    flex: 1,
  },
  progressDot: {
    width: 16,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#A0A0A0',
    marginHorizontal: 4,
  },
  progressDotActive: {
    width: 24,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.7,
    color: COLORS.placeholder,
  },
  buttonContainer: {
    paddingBottom: 20,
  },
});

export default OnboardingScreenStep;
