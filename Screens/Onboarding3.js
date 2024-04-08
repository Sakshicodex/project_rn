import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

const OnboardingScreen3 = ({ navigation }) => {
    const currentScreenIndex = 2;
    const renderPaginationIndicators = () => {
        return [0, 1, 2].map((_, index) => (
            <View
                key={index}
                style={[
                    styles.paginationDot,
                    currentScreenIndex === index ? styles.activeDot : styles.inactiveDot,
                ]}
            />
        ));
    };
    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/o3.png')} // Replace with the path to your third background image
                style={styles.backgroundImage}
            >
                {/* Background content can go here */}
            </ImageBackground>

            <View style={styles.overlay}>
                <View style={styles.textContainer}>
                    <Text style={styles.headerText}>We serve</Text>
                    <Text style={[styles.headerText, styles.incomparableText]}>incomparable</Text>
                    <Text style={[styles.headerText, styles.delicaciesText]}>delicacies</Text>
                </View>
                <Text style={styles.subHeaderText}>
                    All the best restaurants with their top menu waiting for you, they can't wait for your order!
                </Text>
                <View style={styles.paginationContainer}>
                    {renderPaginationIndicators()}
                </View>
                
                <TouchableOpacity onPress={() => navigation.navigate('login')} style={styles.nextButton}>
                    <Text style={styles.buttonText}>→</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // Center the square vertically
        alignItems: 'center', // Center the square horizontally
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    overlay: {
        borderRadius: 40,
        backgroundColor: '#FE8C00',
        position: 'absolute',
        top: '65%',
        left: 0,
        right: 0,
        transform: [{ translateY: -150 }], // Adjust this value to center the overlay based on its height
        padding: 10,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 30,
        
    },
    textContainer: {
        marginTop:15,
        alignItems: 'center',
        justifyContent: 'center',
      },
    headerText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 7,
    },
    subHeaderText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    paginationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paginationDot: {
        width: 20,
        height: 8,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: '#FFFFFF',
    },
    inactiveDot: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    nextButton: {
        marginTop: 20,
        width: 100,  // Width of the circle
        height: 100,  
        backgroundColor: '#FFFFFF', // Assuming the button is white based on your design
        paddingVertical: 10,
        paddingHorizontal: 30,
        justifyContent: 'center', // Center the text vertically
        alignItems: 'center',
        borderRadius: 50, // Makes it circular
        elevation: 3, // Adds shadow on Android
        // For iOS shadow:
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        color: '#FFA500', // Assuming the text color is orange based on your design
        fontSize: 18,
        fontWeight: 'bold',

    },
});

export default OnboardingScreen3;
