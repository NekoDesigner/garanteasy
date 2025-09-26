import React from "react";
import { Modal, View, Pressable } from "react-native";
import CloseIcon from "../Icons/CloseIcon";
import { ICustomAlertProps } from "./@types";
import CustomAlertAction from "./Action";
import styles from "./styles";

interface CustomAlertComponent extends React.FC<ICustomAlertProps> {
  Action: typeof CustomAlertAction;
}

const CustomAlert: CustomAlertComponent = ({
  children,
  onClose,
  visible = true,
}) => {
  const handleOverlayPress = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleContainerPress = (event: any) => {
    // Empêche la propagation du press event pour ne pas fermer la modal quand on clique à l'intérieur
    event.stopPropagation();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={handleOverlayPress}>
        <Pressable style={styles.container} onPress={handleContainerPress}>
          <View style={styles.content}>
            {/** Croix pour fermer la modal */}
            <View style={{ alignItems: "flex-end", marginBottom: 8 }}>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <CloseIcon size={16} color="#333" />
              </Pressable>
            </View>
            {React.Children.map(children, (child) => {
              // Filtrer les éléments qui ne sont pas des CustomAlert.Action pour les afficher dans le contenu
              if (React.isValidElement(child) && child.type === CustomAlertAction) {
                return null;
              }
              return child;
            })}
          </View>

          <View style={styles.actionsContainer}>
            {React.Children.map(children, (child) => {
              // Afficher seulement les CustomAlert.Action dans la section des actions
              if (React.isValidElement(child) && child.type === CustomAlertAction) {
                return child;
              }
              return null;
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

// Attacher le composant Action comme propriété statique
CustomAlert.Action = CustomAlertAction;

export default CustomAlert;