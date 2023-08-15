import { StyleSheet, Image } from 'react-native'

export default ImageViewer = ({ placeholderImageSource, selectedImage }) => {
    
    const imageSource = selectedImage ? {uri: selectedImage} : placeholderImageSource;
    return (
        <Image resizeMode= 'cover' source={imageSource} style={styles.image} />
    )
}

const styles = StyleSheet.create({
    image: {
        width: 320,
        height: 440,
        borderRadius: 18,
      },
})
