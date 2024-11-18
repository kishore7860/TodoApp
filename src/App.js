import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const fadeAnim = useRef(new Animated.Value(1)).current; // For fade animation

  useEffect(() => {
    loadTasksFromStorage().then(setTasks);
  }, []);

  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  const saveTasksToStorage = async (tasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks.', e);
    }
  };

  const loadTasksFromStorage = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (e) {
      console.error('Failed to load tasks.', e);
      return [];
    }
  };

  const handleTaskSubmit = () => {
    if (editingTaskId) {
      updateTask();
    } else {
      addTask();
    }
  };

  const addTask = () => {
    if (typeof task === 'string' && task.trim()) {
      const newTask = { id: Date.now().toString(), text: task.trim(), completed: false };
      setTasks([...tasks, newTask]);
      setTask('');
      triggerFadeIn(); // Trigger fade-in animation
    }
  };

  const updateTask = () => {
    if (typeof task === 'string' && task.trim()) {
      setTasks(
        tasks.map((t) =>
          t.id === editingTaskId ? { ...t, text: task.trim() } : t
        )
      );
      setTask('');
      setEditingTaskId(null);
    }
  };

  const deleteTask = (taskId) => {
    triggerFadeOut(() => {
      setTasks(tasks.filter((item) => item.id !== taskId));
    });
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const editTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    setTask(taskToEdit.text);
    setEditingTaskId(taskId);
  };

  // Animation functions
  const triggerFadeIn = () => {
    fadeAnim.setValue(0); // Reset animation to start from 0 opacity
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const triggerFadeOut = (onComplete) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onComplete && onComplete());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Tasks</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a task"
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity
          style={[styles.addButton, !task.trim() && styles.disabledButton]}
          onPress={handleTaskSubmit}
          disabled={!task.trim()}
        >
          <Text style={styles.addButtonText}>
            {editingTaskId ? 'Update' : '+'}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <Animated.View style={[styles.taskContainer, { opacity: fadeAnim }]}>
            <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
              <Text
                style={[
                  styles.taskText,
                  item.completed && styles.completedTask,
                ]}
              >
                {item.text}
              </Text>
            </TouchableOpacity>
            <View style={styles.taskActions}>
              <TouchableOpacity onPress={() => editTask(item.id)}>
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Text style={styles.deleteButton}>X</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#5C5CFF',
    height: 40,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginLeft: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    color: '#007BFF',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 10,
  },
  deleteButton: {
    color: '#FF5C5C',
    fontWeight: 'bold',
    fontSize: 18,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});
