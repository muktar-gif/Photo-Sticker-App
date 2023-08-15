import { View, Image } from 'react-native'
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    useAnimatedGestureHandler,
    withSpring,
} from 'react-native-reanimated';
import { TapGestureHandler, PanGestureHandler } from 'react-native-gesture-handler';
import { useRef } from 'react';

const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedView = Animated.createAnimatedComponent(View);

export default function EmojiSticker({imageSize, stickerSource}) {

  // Define shared animation values    
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const scaleImage = useSharedValue(imageSize);
    const scaleOffsetPos = useSharedValue(0);
    const upScale = useRef(true);
    
    // Double-tap gesture handler for scaling the image
    const onDoubleTap = useAnimatedGestureHandler({
        
        onActive: () => {

            // Check if the current scale exceeds the maximum (6 times) or the minimum (original size) scale
            if (scaleImage.value >= imageSize * 6) {
                upScale.current = false;
            }
            else if (scaleImage.value <= imageSize){
                upScale.current = true;
            }
       
            if (upScale.current) {
                // If scaling up, reduce the center offset and double the image scale
                scaleOffsetPos.value += -scaleImage.value/2;
                scaleImage.value *= 2;
            }
            else{
                // If scaling down, increase the center offset and halve the image scale
                scaleImage.value /= 2;
                scaleOffsetPos.value += scaleImage.value/2;
            } 

        }

    });


    const onDrag = useAnimatedGestureHandler({
        onStart: (event, context) => {
          context.translateX = translateX.value;
          context.translateY = translateY.value;
        },
        onActive: (event, context) => {
          translateX.value = event.translationX + context.translateX;
          translateY.value = event.translationY + context.translateY;
        },
    });
      
    const imageStyle = useAnimatedStyle(() => {
         
        return {
          width: withSpring(scaleImage.value, {
            damping: 17, // Adjust the damping value to control the spring's oscillation
            restSpeedThreshold: 0.9, // Lower value means quicker rest
          }),
          height: withSpring(scaleImage.value, {
            damping: 17, // Adjust the damping value to control the spring's oscillation
            restSpeedThreshold: 0.9, // Lower value means quicker rest
          }),
          transform: [
            {
              translateX: withSpring(scaleOffsetPos.value, {
                damping: 17, // Adjust the damping value to control the spring's oscillation
                restSpeedThreshold: 0.9, // Lower value means quicker rest
              }),
            },
            {
              translateY: withSpring(scaleOffsetPos.value, {
                damping: 17, // Adjust the damping value to control the spring's oscillation
                restSpeedThreshold: 0.9, // Lower value means quicker rest
              }),
            },
          ],
        };
    });
    
    const containerStyle = useAnimatedStyle(() => {
        return {
          transform: [
            {
              translateX: translateX.value,
            },
            {
              translateY: translateY.value,
            },
          ],
        };
    });

    return (
        <PanGestureHandler onGestureEvent={onDrag}>
            <AnimatedView style={[containerStyle, {top: '-30%', left: '35%'}]}>
                <TapGestureHandler onGestureEvent={onDoubleTap} numberOfTaps={2}>
                    <AnimatedImage
                        source={stickerSource}
                        resizeMode="contain"
                        style={[imageStyle, {width: imageSize, height: imageSize}]}
                    />
                </TapGestureHandler>
            </AnimatedView>
        </PanGestureHandler>
  );
}