import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

type TaskType = {
  id: string;
  title: string;
  description: string;
  date: string;    
  location: string;
  status: 'pending' | 'inProgress' | 'completed' | 'cancelled';
};

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<TaskType | null>(null);

  // Fetch task details from AsyncStorage
  const fetchTaskDetails = useCallback(async () => {
    if (!id) return;

    try {
      const raw = await AsyncStorage.getItem('my-tasks');
      const list: TaskType[] = raw ? JSON.parse(raw) : [];
      const foundTask = list.find(t => t.id === id);
      setTask(foundTask ?? null);
    } catch (error) {
      console.error("Failed to fetch task details:", error);
      setTask(null);
    }
  }, [id]);

  // Call fetchTaskDetails when component mounts or id changes
  useEffect(() => {
    fetchTaskDetails();
  }, [fetchTaskDetails]);

  // Update the task's status in AsyncStorage
  const updateStatus = async (newStatus: TaskType['status']) => {
    if (!task) return;
    try {
      const raw = await AsyncStorage.getItem('my-tasks');
      const list: TaskType[] = raw ? JSON.parse(raw) : [];
      const updatedList = list.map(t =>
        t.id === id ? { ...t, status: newStatus } : t
      );
      await AsyncStorage.setItem('my-tasks', JSON.stringify(updatedList));
      setTask(prev => prev && { ...prev, status: newStatus });
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not update task status.");
    }
  };

  // Delete task after confirmation
  const deleteTask = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const raw = await AsyncStorage.getItem('my-tasks'); 
              const list: TaskType[] = raw ? JSON.parse(raw) : [];
              const filteredList = list.filter(t => t.id !== id);
              await AsyncStorage.setItem('my-tasks', JSON.stringify(filteredList));
              router.back();
            } catch (error) {
              console.log(error);
              Alert.alert("Error", "Could not delete task.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Show loading if task is not yet fetched
  if (!task) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading task details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.goBackButton} 
        >
            <Text style={styles.goBackButtonText}>← Go Back</Text> 
        </TouchableOpacity>

        <Text style={styles.title}>{task.title}</Text>
        
        <View style={styles.detailItem}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.text}>{task.description || 'No description provided.'}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Date & Time:</Text>
          <Text style={styles.text}>
            {new Date(task.date).toLocaleString(undefined, { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.text}>{task.location}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.label}>Current Status:</Text>
          <Text style={[styles.text, styles.statusText, styles[`status${task.status}`]]}>
            {task.status === 'inProgress' ? 'In Progress' : task.status}
          </Text>
        </View>

        <Text style={[styles.label, { marginTop: 25, marginBottom: 10 }]}>Update Status:</Text>
        <View style={styles.statusButtonsContainer}>
          {(['pending', 'inProgress', 'completed', 'cancelled'] as TaskType['status'][]).map(st => (
            <TouchableOpacity
              key={st}
              style={[styles.statusButton, task.status === st && styles.activeStatusButton]}
              onPress={() => updateStatus(st)}
              disabled={task.status === st}
            >
              <Text style={[styles.statusButtonText, task.status === st && styles.activeStatusButtonText]}>
                {st === 'inProgress' ? 'in progress' : st}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.deleteButtonContainer}>
          <TouchableOpacity style={styles.deleteButton} onPress={deleteTask}>
            <Text style={styles.deleteButtonText}>Delete Task</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f4f8',
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexGrow: 1,
  },
  loadingContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#f4f4f8',
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
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
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  detailItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#555',
    marginBottom: 5,
  },
  text: { 
    fontSize: 16, 
    color: '#333',
    lineHeight: 22,
  },
  statusText: {
    fontWeight: 'bold',
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statusButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    minWidth: '48%', 
    alignItems: 'center',
    marginBottom: 10,
  },
  activeStatusButton: {
    backgroundColor: '#007AFF',
  },
  statusButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  activeStatusButtonText: {
    color: '#fff',
  },
  deleteButtonContainer: {
    marginTop: 'auto', 
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statuspending: {
    color: '#orange', 
  },
  statusinProgress: {
    color: '#2196F3',
  },
  statuscompleted: {
    color: '#4CAF50',
  },
  statuscancelled: {
    color: '#757575',
  },
});