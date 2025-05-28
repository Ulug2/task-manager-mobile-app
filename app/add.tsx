import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, Button, TouchableOpacity, ScrollView } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from "@react-native-async-storage/async-storage";

type TaskType = {
  id: string,
  title: string,
  description: string,
  date: string,   
  location: string,
  status: 'pending' | 'inProgress' | 'completed' | 'cancelled';
}

export default function AddScreen() {

    const router = useRouter();
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [location, setLocation] = useState<string>('')
    const [date, setDate] = useState<string>(new Date().toISOString()) 
    const [error, setError] = useState('')
    const [showPicker, setShowPicker] = useState<boolean>(false)

    // Save task function: validates input, saves task, and navigates back
    const saveTask = async () => {
        if (!title.trim()){
            setError("Title field is required.")
            return;
        }
        if (!location.trim()){
            setError("Location field is required.")
            return;
        }
        setError('');

        const newTask: TaskType = {
            id: Date.now().toString(),
            title: title.trim(),
            description: description.trim(),
            date: date,
            location: location.trim(),
            status: 'pending',
        };

        try {
            const raw = await AsyncStorage.getItem("my-tasks");
            const list: TaskType[] = raw ? JSON.parse(raw) : [];
            await AsyncStorage.setItem("my-tasks", JSON.stringify([...list, newTask]));
            router.back();
        } catch (e) {
            console.log(e);
            setError("Failed to save task. Please try again.");
        }
    }

    // Handle date change from DateTimePicker
    const onChangeDate = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || new Date(date);
        setShowPicker(Platform.OS === 'ios');
        if (selectedDate) {
          setDate(currentDate.toISOString());
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        style={styles.goBackButton} 
                    >
                        <Text style={styles.goBackButtonText}>← Go Back</Text> 
                    </TouchableOpacity>

                    {error.length > 0 && <Text style={styles.errorText}>{error}</Text>}
                    
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        placeholder="Enter task title"
                        value={title}
                        onChangeText={setTitle}
                        style={styles.input}
                    />

                    <Text style={styles.label}>Description (Optional)</Text>
                    <TextInput
                        placeholder="Enter task description"
                        value={description}
                        onChangeText={setDescription}
                        style={[styles.input, styles.textArea]}
                        multiline
                        numberOfLines={4}
                    />

                    <Text style={styles.label}>Location</Text>
                    <TextInput
                        placeholder="Enter task location"
                        value={location}
                        onChangeText={setLocation}
                        style={styles.input}
                    />

                    <Text style={styles.label}>Date & Time</Text>
                    <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateDisplayButton}>
                        <Text style={styles.dateDisplayText}>
                            {date 
                                ? new Date(date).toLocaleString(undefined, { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric', 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  }) 
                                : 'Set Date & Time'}
                        </Text>
                    </TouchableOpacity>

                    {showPicker && (
                        <DateTimePicker 
                            value={new Date(date)}
                            mode="datetime"
                            display="default"
                            onChange={onChangeDate}
                        />
                    )}
                    
                    <View style={{ flexGrow: 1 }} /> 

                    <TouchableOpacity style={styles.saveButton} onPress={saveTask}>
                        <Text style={styles.saveButtonText}>Save Task</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f4f4f8',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    goBackButton: {
        alignSelf: 'flex-start',
        marginBottom: 20,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#e0e0e0',
        borderRadius: 20,
    },
    goBackButtonText: { 
        color: '#333',
        fontSize: 14,
        fontWeight: '500',
    },
    errorText: {
        color: '#d32f2f',
        backgroundColor: '#ffcdd2',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 14,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 18,
        borderRadius: 8,
        fontSize: 16,
        color: '#333',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    dateDisplayButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 18,
        borderRadius: 8,
        alignItems: 'center',
    },
    dateDisplayText: {
        fontSize: 16,
        color: '#007AFF',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    saveButtonText: { 
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    }
});