import React, { useState, useCallback } from 'react'; 
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

type TaskType = {
  id: string,
  title: string,
  description: string,
  date: string,   
  location: string,
  status: 'pending' | 'inProgress' | 'completed' | 'cancelled';
}

export default function Index() {
  const [tasks, setTasks] = useState<TaskType[]>([])
  const [sortingMode, setSortingMode] = useState<'date' | 'status'>('date');
  const router = useRouter();

  // Function to fetch tasks from AsyncStorage
  const fetchTasks = useCallback(async () => { 
    try {
      const storedTasks = await AsyncStorage.getItem('my-tasks')
      if (storedTasks !== null){
        setTasks(JSON.parse(storedTasks))
      } else {
        setTasks([]); 
      }
    }
    catch (e) {
      console.log("Error fetching tasks:", e)
      setTasks([]); 
    }
  }, []); 

  // Refresh tasks whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchTasks();
      return;
    }, [fetchTasks]) 
  );

  // Sort tasks based on the selected sorting mode
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortingMode === 'date'){
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    else {
      // Compare tasks by status in alphabetical order if sorting mode is 'status'
      return a.status.localeCompare(b.status);
    }
  }) 

  return (
    <SafeAreaView style={styles.container}> 
      <View style={styles.header}>
        <Text style={styles.headerText}>My Tasks</Text>
      </View>

      <View style={styles.sortContainer}>
        <TouchableOpacity
          onPress={() => setSortingMode('date')}
          style={[
            styles.sortButton,
            sortingMode === 'date' && styles.activeSortButton
          ]}
        >
          <Text style={[styles.sortButtonText, sortingMode === 'date' && styles.activeSortButtonText]}>Sort by Date</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSortingMode('status')}
          style={[
            styles.sortButton,
            sortingMode === 'status' && styles.activeSortButton
          ]}
        >
          <Text style={[styles.sortButtonText, sortingMode === 'status' && styles.activeSortButtonText]}>Sort by Status</Text>
        </TouchableOpacity>
      </View>

      {tasks.length === 0 ? (
        <View style={styles.emptyTasksContainer}>
          <Text style={styles.emptyTasksText}>No tasks yet. Add one!</Text>
        </View>
      ) : (
        <FlatList
          data={sortedTasks}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => router.push(`/${item.id}`)}>
              <View style={styles.listItemTextContainer}>
                <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.itemDate}>
                  {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} - {new Date(item.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <Text style={[styles.itemStatus, styles[`status${item.status}`]]}>
                  {item.status === 'inProgress' ? 'In Progress' : item.status}
                </Text>
              </View>
              <Text style={styles.listItemArrow}>›</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContentContainer}
        />
      )}
      
      <View style={styles.addButtonContainer}>
        <Link href="/add" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </Link>
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f8',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 10,
  },
  sortButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  activeSortButton: {
    backgroundColor: '#007AFF',
  },
  sortButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  activeSortButtonText: {
    color: '#fff',
  },
  listContentContainer: {
    paddingHorizontal: 15,
    paddingBottom: 80, 
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  listItemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  itemDate: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  itemStatus: {
    fontSize: 13,
    fontWeight: '500',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
    overflow: 'hidden', 
  },
  statuspending: {
    backgroundColor: '#ffeb3b', 
    color: '#795548', 
  },
  statusinProgress: {
    backgroundColor: '#2196F3',
    color: '#fff',
  },
  statuscompleted: {
    backgroundColor: '#4CAF50',
    color: '#fff',
  },
  statuscancelled: {
    backgroundColor: '#f44336',
    color: '#fff',
  },
  listItemArrow: {
    fontSize: 24,
    color: '#c7c7cc',
    marginLeft: 10,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  addButton: {
    width: 60,
    height: 60,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 30,
    lineHeight: 30, 
  },
  emptyTasksContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTasksText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  }
});