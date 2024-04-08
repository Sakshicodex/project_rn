import React, { useState ,useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, TextInput, Button, StyleSheet, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const OtpScreen = ({ route}) => {
  const [otp, setOTP] = useState(['', '', '', '']);
  const email = route.params.email; 
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);
  const navigation = useNavigation();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          setResendEnabled(true);
          return 0;
        }
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

   
  const otpRefs = [
    React.createRef(),
    React.createRef(),
    React.createRef(),
    React.createRef(),
  ];

  const handleOTPChange = (index, value) => {
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);
  
    if (value !== '') {
      if (index < otpRefs.length - 1) {
        otpRefs[index + 1].current.focus();
      }
    }
  };

  

  const handleOTPVerification = async () => {
    const enteredOTP = otp.join('');
  
    // Send the OTP code and the email to your backend for verification
    const response = await fetch('http://10.9.11.209:3000/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otp: enteredOTP, email }),
    });
  
    const data = await response.json();
    if (data.success) {
      // OTP verification successful
      console.log('OTP verification successful');
  
      // Make an API call to generate the reset token
      const resetTokenResponse = await fetch('http://10.9.11.209:3000/generate-reset-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      const resetTokenData = await resetTokenResponse.json();
      if (resetTokenData.success) {
        const resetToken = resetTokenData.token;
        // Navigate to the ResetPasswordScreen and pass the token
        navigation.navigate('resetpassword', { token: resetToken });
      } else {
        console.log('Failed to generate reset token');
      }
    } else {
      // OTP verification failed, display an error message
      console.log('OTP verification failed');
      Alert('Invalid OTP. Please try again.'); // Display an error message to the user
    }
  };

  const handleResendCode = async () => {
    setResendEnabled(false);
    setTimer(60);
    setOTP(['', '', '', '']);

    try {
      const response = await fetch('http://10.9.11.209:3000/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Email verification</Text>
        <Text style={styles.subtitle}>Enter the verification code we sent you on:</Text>
        <Text style={styles.email}>{email}</Text> 
        

        <View style={styles.otpContainer}>
          {otp.map((value, index) => (
            <TextInput
              key={index}
              ref={otpRefs[index]}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
               onChangeText={(text) => handleOTPChange(index, text)}
              value={value}
              
            />
          ))}
        </View>

        <Text style={styles.resendText}>
        Didn't receive code?{' '}
        <Text style={resendEnabled ? styles.resendLinkEnabled : styles.resendLinkDisabled} onPress={resendEnabled ? handleResendCode : null}>
          Resend
        </Text>
        {!resendEnabled && (
          <Text style={styles.timerText}>
            {' '}({timer}s)
          </Text>
        )}
      </Text>

        <TouchableOpacity style={styles.button} onPress={ handleOTPVerification}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
},
title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 30,
    marginBottom: 10,
    alignSelf: 'flex-start',
},
subtitle: {
    fontSize: 18,
    color: '#666',
    
    alignSelf: 'flex-start',
},
email: {
   
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    alignSelf: 'flex-start', 
},
otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignSelf: 'stretch',
    paddingHorizontal: 10,
},
otpInput: {
    width: 70,
    height: 65,
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
},
resendText: {
  fontSize: 16,
  color: '#666',
  marginBottom: 20,
},
resendLinkEnabled: {
  color: '#ff9800',
  textDecorationLine: 'underline',
},
resendLinkDisabled: {
  color: '#ccc',
},
button: {
    backgroundColor: '#FFA500',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
},
buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize:15,
},
timer: {
    color: '#000000',
    marginVertical: 20,
},
});

export default OtpScreen;
