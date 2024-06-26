import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient'; // Importa LinearGradient
import { AntDesign } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons';

interface Note {
    id: string;
    title: string;
    content: string;
    completed: boolean;
}

export default function NotasScreen() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteContent, setNewNoteContent] = useState('');
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const router = useRouter();

useEffect(() => {
    loadNotes();
}, []);

const loadNotes = async () => {
    try {
    const currentUser = await AsyncStorage.getItem('currentUser');
    if (currentUser) {
        const userNotes = await AsyncStorage.getItem(`notes_${currentUser}`);
        if (userNotes) {
        setNotes(JSON.parse(userNotes));
        }
    }
    } catch (error) {
    console.error('Error loading notes', error);
    }
};

const saveNote = async () => {
    try {
    const currentUser = await AsyncStorage.getItem('currentUser');
    if (currentUser) {
        // Validar que el título y el contenido no estén vacíos
        if (!newNoteTitle.trim() && !newNoteContent.trim()) {
        Alert.alert('El título y el contenido de la nota no pueden estar vacíos.');
        return;
        } else if (!newNoteTitle.trim()) {
            Alert.alert('El título de la nota no puede estar vacio.');
            return;
        } else if (!newNoteContent.trim()) {
            Alert.alert('El contenido de la nota no puede estar vacio.');
            return;
        }

        if (editingNoteId) {
        const updatedNotes = notes.map((note) =>
            note.id === editingNoteId ? { ...note, title: newNoteTitle, content: newNoteContent } : note
        );
        await AsyncStorage.setItem(`notes_${currentUser}`, JSON.stringify(updatedNotes));
        setNotes(updatedNotes);
        setEditingNoteId(null);  // Limpiar el estado de edición
        setShowForm(false); // Ocultar el formulario de edición después de guardar cambios
        } else {
        const newNote: Note = {
            id: String(Date.now()),
            title: newNoteTitle,
            content: newNoteContent,
            completed: false, // Nueva nota por defecto no está completada
        };
        const updatedNotes = [...notes, newNote];
        await AsyncStorage.setItem(`notes_${currentUser}`, JSON.stringify(updatedNotes));
        setNotes(updatedNotes);
        }
        setNewNoteTitle('');
        setNewNoteContent('');

        Alert.alert('Guardado satisfactoriamente!');
        router.push('/notas');
    }
    } catch (error) {
    console.error('Error saving note', error);
    }
};

const editNote = (noteId: string) => {
    const noteToEdit = notes.find((note) => note.id === noteId);
    if (noteToEdit) {
    setNewNoteTitle(noteToEdit.title);
    setNewNoteContent(noteToEdit.content);
    setEditingNoteId(noteId);
    setShowForm(true); // Mostrar el formulario de edición al editar una nota
    }
};

const cancelEdit = () => {
    setNewNoteTitle('');
    setNewNoteContent('');
    setEditingNoteId(null);
    setShowForm(false); // Ocultar el formulario de edición al cancelar la edición
};

const deleteNote = async (noteId: string) => {
    try {
    Alert.alert(
        'Confirmar eliminación',
        '¿Estás seguro de que deseas eliminar esta nota?',
        [
        {
            text: 'Cancelar',
            style: 'cancel',
        },
        {
            text: 'Eliminar',
            onPress: async () => {
            const currentUser = await AsyncStorage.getItem('currentUser');
            if (currentUser) {
                const updatedNotes = notes.filter((note) => note.id !== noteId);
                await AsyncStorage.setItem(`notes_${currentUser}`, JSON.stringify(updatedNotes));
                setNotes(updatedNotes);
            }
            },
            style: 'destructive',
        },
        
        ]
    );

    
    } catch (error) {
    console.error('Error deleting note', error);
    }
};

const toggleCompleteNote = async (noteId: string) => {
    try {
    const currentUser = await AsyncStorage.getItem('currentUser');
    if (currentUser) {
        const updatedNotes = notes.map((note) =>
        note.id === noteId ? { ...note, completed: !note.completed } : note
        );
        await AsyncStorage.setItem(`notes_${currentUser}`, JSON.stringify(updatedNotes));
        setNotes(updatedNotes);
    }
    } catch (error) {
    console.error('Error toggling note completion', error);
    }
};

const confirmLogout = () => {
    Alert.alert(
        'Cerrar sesión',
        '¿Estás seguro de que deseas cerrar sesión?',
        [
            {
                text: 'Cancelar',
                style: 'cancel',
            },
            {
                text: 'Cerrar sesión',
                onPress: () => handleLogout(),
                style: 'destructive',
            },
        ]
    );
};

const handleLogout = async () => {
    await AsyncStorage.removeItem('currentUser');
    router.push('/login');
};

const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
);

const totalNotes = notes.length;
const completedNotes = notes.filter(note => note.completed).length;
const pendingNotes = totalNotes - completedNotes;

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
    
    <View style={styles.inputContainer}>
        {!showForm ? (
        <View style={styles.tituloNotas}>
            <Text style={styles.title}>Notas</Text>
            <TouchableOpacity style={styles.iconButton} onPress={() => setShowForm(true)}>
                <Ionicons style={styles.iconNotas} name="add-circle-outline" size={30} color="black" />
            </TouchableOpacity>
        </View>
        ) : (
        <View style={styles.nuevaNota}>
            <Text style={styles.title2}>Nota</Text>

            <TextInput
            style={styles.input}
            placeholder="Título de la nota"
            value={newNoteTitle}
            onChangeText={setNewNoteTitle}
            />
            <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Contenido de la nota"
            value={newNoteContent}
            onChangeText={setNewNoteContent}
            multiline
            />
            
            <View style={styles.cajacrear}>
                <TouchableOpacity style={styles.buttonContainer} onPress={saveNote}>
                    <Text style={styles.buttonText}>
                        {editingNoteId ? "Guardar Cambios" : "Guardar Nota"}
                    </Text>
                </TouchableOpacity>
            
                {editingNoteId && (
                    <TouchableOpacity style={styles.buttonContainer2} onPress={cancelEdit}>
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                )}
                {!editingNoteId && (
                    <TouchableOpacity style={styles.buttonContainer2} onPress={() => setShowForm(false)}>
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
        )}
    </View>
    {showForm ? null : (
        <View style={{ flex: 1 }}>
        <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} style={styles.searchIcon} />
            <TextInput
            style={styles.searchInput}
            placeholder="Buscar notas"
            value={searchQuery}
            onChangeText={setSearchQuery}
            />
        </View>

        <View style={styles.cajaTotales}>
            <Text style={styles.letter}>Total: {totalNotes}</Text>
            <Text style={styles.letter}>Completas: {completedNotes}</Text>
            <Text style={styles.letter}>Pendientes: {pendingNotes}</Text>
        </View>
        <View style={styles.noteContainerNote}>
        {filteredNotes.length > 0 ? (
            <FlatList
            data={filteredNotes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => editNote(item.id)}>
                    <View style={styles.noteContainer}>
                        <View style={styles.noteContentContainer}>
                        <Text style={styles.noteTitle}>{item.title}</Text>
                        <Text style={styles.noteContent}>{item.content}</Text>
                        </View>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteNote(item.id)}>
                        <Ionicons name="trash-bin" size={24} color="red" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.completeButton} onPress={() => toggleCompleteNote(item.id)}>
                        <Ionicons name={item.completed ? "checkmark-circle" : "ellipse-outline"} size={24} color={item.completed ? "green" : "gray"} />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            )}
            />
        ) : (
            <Text style={styles.noNotesText}>No hay notas con este nombre</Text>
        )}
        </View>
        <TouchableOpacity onPress={confirmLogout}>
            <Text style={styles.link}>Cerrar sesión</Text>
        </TouchableOpacity>
        </View>
    )}
    </View>
    </LinearGradient>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    padding: 16,
    width: '100%',
},
title: {
    fontSize: 40,
    fontWeight: '700',
    color: 'white',
},
title2: {
    fontSize: 40,
    fontWeight: '700',
    color: 'white',
    marginBottom: 30,
},
subtitle: {
    fontSize: 18,
    marginBottom: 8,
    marginTop: 16,
    textAlign: 'center',
},
inputContainer: {
    marginBottom: 16,
},
input: {
    height: 50,
    backgroundColor:'#f3f3f3',
    width: '100%',
    borderRadius: 20,
    marginBottom: 12,
    marginTop: 10,
    paddingHorizontal: 8,
},
noteContainer: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
},
noteContentContainer: {
    flex: 1,
},
noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
},
noteContent: {
    fontSize: 16,
},
link: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
},
deleteButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
},
searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 12,
    backgroundColor:'#f3f3f3',
    width: '100%',
    borderRadius: 20,
},
searchIcon: {
    marginRight: 8,
},
searchInput: {
    flex: 1,
    height: 50,
    
},
noNotesText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
},
completeButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
},
gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin:0,
    padding:0,
},
tituloNotas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 70,
},
iconButton: {
    padding: 10, 
    borderRadius: 5, 
  },
  iconNotas: {
    color: 'white',
    fontSize: 40,
  },
  noteContainerNote: {
    backgroundColor: 'white',
    borderRadius: 20,
    height: '70%',
    padding: 10,
  },
  cajaTotales: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    marginTop: 10,
  },
  letter: {
    color: 'white',
    fontWeight: 'bold',
  },
  nuevaNota: {
    marginTop: 70,
  },
  buttonContainer: {
    backgroundColor: 'purple',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 16,
    width: '50%',
},
buttonContainer2: {
    backgroundColor: 'grey',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 16,
    width: '40%',
},
buttonText: {
color: 'white',
fontSize: 18,
fontWeight: 'bold',
textAlign: 'center',
},
cajacrear: {
    flexDirection: 'row',
    justifyContent: 'space-between',
}
});
