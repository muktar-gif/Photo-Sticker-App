// React and React Native imports
import { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// Expo imports
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

// Gesture handling
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Reanimated for animations
import { layout } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

// Custom component imports
import ImageViewer from './components/ImageViewer';
import Button from './components/Button';
import CircleButton from './components/CircleButton';
import IconButton from './components/IconButton';
import EmojiPicker from './components/EmojiPicker';
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';

// Import types from Expo's ImagePicker and capture image
import { UIImagePickerPresentationStyle } from 'expo-image-picker/build/ImagePicker.types';
import { captureRef } from 'react-native-view-shot';


const PlaceHolderImage = require('./assets/images/background-image.png');

export default function App() {

  // State variables for managing app behavior
  const [selectedImage, setSelectedImage] = useState(null); // Selected image URI
  const [showAppOptions, setShowAppOptions] = useState(false); // Flag to show app options
  const [isModalVisible, setIsModalVisible] = useState(false); // Flag to control modal visibility
  const [pickedEmoji, setPickedEmjoi] = useState(null); // Picked emoji
  const [status, requestPermission] = MediaLibrary.usePermissions(); // MediaLibrary permissions status

  // Reference to the image component
  const imageRef = useRef();

  // Request permissions if status is null
  if (status === null) {
    requestPermission();
  }

  // Function to reset app options and picked emoji
  const onReset = () => {
    setShowAppOptions(false);
    setPickedEmjoi(null);
  };

  // Function to set modal visibility
  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  // Function to close the modal
  const onModalClose = () => {
    setIsModalVisible(false);
  };

  // Function to save the edited image to the device's library
  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      });

      // Save the image to the library and show alert if successful
      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert("Saved");
      } 
    } catch (e) {
      console.log(e);
      alert("No permission");
    }
  };

  // Function to pick an image from the device's library
  const pickImageAysnc = async () => {
    let result = await ImagePicker.launchImageLibraryAsync(
      {
        presentationStyle: UIImagePickerPresentationStyle.CURRENT_CONTEXT,
        allowsEditing: true,
        quality: 1,
      } 
    );

    // Set selected image and show app options if image is selected
    if (!result.canceled){
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    }
  };
  
  return (
      <GestureHandlerRootView style={styles.container}>
        <Animated.View layout={layout} style={styles.imageContainer}>
          <View ref={imageRef} collapsable={false}>
            <ImageViewer  
              placeholderImageSource={PlaceHolderImage}
              selectedImage={selectedImage}
            />
            {pickedEmoji !== null? <EmojiSticker imageSize={40} stickerSource={pickedEmoji}/>: null}
          </View>
        </Animated.View>

        {showAppOptions ? (
          <View style={styles.optionsContainer}>
            <View style={styles.optionsRow}>
              <IconButton icon="refresh" label="Reset" onPress={onReset}/>
              <CircleButton onPress={onAddSticker}/>
              <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync}/>
            </View>
          </View>
          ) : (
          <View style={styles.footerContainer}>
            <Button label="Choose a photo" theme="primary" onPress={pickImageAysnc}/>
            <Button label="Use this photo" onPress={() => setShowAppOptions(true)}/>
          </View>
        )}
        <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
          <EmojiList onSelect={setPickedEmjoi} onCloseModel={onModalClose}/>      
        </EmojiPicker>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

