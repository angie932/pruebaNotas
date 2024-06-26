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

export default function RegisterScreen() {
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const router = useRouter();

const handleRegister = async () => {
    if (!username || !password) {
    Alert.alert('Por favor, complete todos los campos.');
    return;
    }

    // Validar la contraseña
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
if (!passwordRegex.test(password)) {
    Alert.alert('La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula y un número.');
    return;
}

    // Obtener usuarios actuales de AsyncStorage (si existen)
    let users: User[] = [];
    try {
    const existingUsers = await AsyncStorage.getItem('users');
    if (existingUsers) {
        users = JSON.parse(existingUsers);
    }
    } catch (error) {
    Alert.alert('Error al obtener usuarios');
    console.error(error);
    return;
    }

    // Verificar si el usuario ya existe
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
    Alert.alert('Este nombre de usuario ya está en uso. Por favor, elija otro.');
    return;
    }

    // Guardar nuevo usuario
    const newUser: User = { username, password };
    users.push(newUser);

    try {
    await AsyncStorage.setItem('users', JSON.stringify(users));
    Alert.alert('Usuario registrado satisfactoriamente!');
    router.replace('/login');
    } catch (error) {
    Alert.alert('Error al guardar usuario');
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
    <Text style={styles.title}>Register</Text>
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
        <TouchableOpacity style={styles.buttonContainer} onPress={handleRegister}>
            <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/login')}>
        <View style={styles.link}>
            <Text style={styles.link1}>Ya eres miembro? </Text>
            <Text style={styles.link2}>Inicia sesion</Text>
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
title: {
    fontSize: 60,
    marginBottom: 25,
    fontWeight: '700',
    alignItems:'center',
    color:'white',
},
gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin:0,
    padding:0,
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
