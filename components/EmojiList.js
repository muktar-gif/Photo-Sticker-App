import { FlatList, Image, Platform, Pressable, StyleSheet } from 'react-native'
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'
import { UIImagePickerPresentationStyle } from 'expo-image-picker/build/ImagePicker.types';


export default function EmojiList({ onSelect, onCloseModel}) {

    const pickImageAysnc = async () => {
        let result = await ImagePicker.launchImageLibraryAsync(
          {
            presentationStyle: UIImagePickerPresentationStyle.CURRENT_CONTEXT,
            allowsEditing: true,
            quality: 1,
          } 
        );
    
        if (!result.canceled){
            const imageSource = {uri: result.assets[0].uri};
            onSelect(imageSource);
            onCloseModel();
        }
      };

    const [emoji] = useState([
        require('../assets/images/emoji1.png'),
        require('../assets/images/emoji2.png'),
        require('../assets/images/emoji3.png'),
        require('../assets/images/emoji4.png'),
        require('../assets/images/emoji5.png'),
        require('../assets/images/emoji6.png'),
    ]);

    return (
        <FlatList 
            horizontal
            showsHorizontalScrollIndicator={Platform.OS === 'web'}
            data={emoji}
            contentContainerStyle={styles.listContainer}
            ListFooterComponent={
                <Pressable onPress={pickImageAysnc}>
                    <MaterialIcons name={"add"} size={100} color="#fff"/>
                </Pressable>
            }
            renderItem={({item, index}) =>{
                return (
                    <Pressable onPress={() => {
                        onSelect(item);
                        onCloseModel();
                    }}>
                        <Image source={item} key={index} style={styles.image}/>
                    </Pressable>
                );
            }}    
        />
    );
}

const styles = StyleSheet.create({
    listContainer: {
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        top: "20%",
        justifyContent: 'space-between',
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 20,
    },
});