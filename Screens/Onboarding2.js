import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

const OnboardingScreen2 = ({ navigation }) => {
    const currentScreenIndex = 1;

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
                source={require('../assets/o2.png')} // Replace with the path to your second background image
                style={styles.backgroundImage}
            />
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
                
            
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('login')} style={styles.skipButton}>
                        <Text style={styles.buttonText}>Skip</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('onboarding3')}style={styles.nextButton}>
                        <Text style={styles.buttonText}>Next →</Text>
                    </TouchableOpacity>
                </View>
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
        padding: 20,
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 50, // Adjust this to position the buttons as needed within the overlay
    },
    skipButton: {
        
    },
    nextButton: {
        
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
    },
});

export default OnboardingScreen2;
