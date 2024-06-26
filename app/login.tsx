import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient'; // Importa LinearGradient
import { AntDesign } from '@expo/vector-icons'; 


interface User {
    username: string;
    password: string;
}

export default function LoginScreen() {
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const router = useRouter();

const handleLogin = async () => {
    if (!username || !password) {
    Alert.alert('Por favor, complete todos los campos.');
    return;
    }

    // Obtener lista de usuarios registrados
    try {
        const users = await AsyncStorage.getItem('users');
        if (users) {
        const parsedUsers: User[] = JSON.parse(users);
    
        const foundUser = parsedUsers.find((user) => user.username === username);
        const foundPassword = parsedUsers.find((user) => user.password === password);

        if (!foundUser) {
            Alert.alert('No existe esa cuenta');
        } else if (foundUser && !foundPassword) {
            Alert.alert('Usuario y/o contraseña incorrectos');
        } else if (foundUser && foundPassword) {
            await AsyncStorage.setItem('currentUser', foundUser.username);
            router.replace('/notas');
        }
        } else {
        Alert.alert('No se encontró ningún usuario registrado');
        }
    } catch (error) {
        Alert.alert('Error al iniciar sesión');
        console.error(error);
    }
    };


return (
    <LinearGradient
        colors={[
          '#b37aa2',
          '#a86fa0',
          '#9b649e',
          '#8b589c',
          '#784d9a',
          '#624399',
          '#463c98',
          '#193697',
          '#003396',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]}
        style={styles.gradient}
      >
    <View style={styles.container}>
    <Text style={styles.title}>Welcome!!</Text>
    <View style={styles.campos}>
    
    <View style={styles.inputContainer}>
        <AntDesign name="user" size={24} color="black" style={styles.icon} />
        <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}    
        onChangeText={setUsername}
    />
    </View>
    
    <View style={styles.inputContainer}>
        <AntDesign name="lock" size={24} color="black" style={styles.icon} />
        <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
    />
    </View>
    <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => router.push('/register')}>
        <View style={styles.link}>
            <Text style={styles.link1}>No tienes una cuenta?</Text>
            <Text style={styles.link2}>Registrate</Text>
        </View>
    </TouchableOpacity>
    </View>
    </View>
    </LinearGradient>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    width: '100%',
},

campos: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingStart: 20,
    paddingEnd: 20,
    paddingTop: 40,
    paddingBottom: 40,
    borderRadius: 40,
},
title: {
    fontSize: 60,
    marginBottom: 25,
    fontWeight: '700',
    alignItems:'center',
    color:'white',
},
inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
},
icon: {
    marginRight: 10,
    color: 'grey',
},
input: {
    height: 50,
    borderWidth: 0,
    backgroundColor:'#f3f3f3',
    marginBottom: 12,
    paddingHorizontal: 8,
    width: '90%',
    borderRadius: 20,
    flex: 1,
},
gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin:0,
    padding:0,
},
buttonContainer: {
    backgroundColor: 'purple',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 16,
    width: '50%',
},
buttonText: {
color: 'white',
fontSize: 18,
fontWeight: 'bold',
textAlign: 'center',
},
link: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
},
link1: {
    marginRight: 5,
},
link2: {
    color: 'red',
    marginLeft: 5,
},
});
