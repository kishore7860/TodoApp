import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TaskItem = ({ task, toggleTaskCompletion, deleteTask }) => (
  <View style={styles.taskContainer}>
    <TouchableOpacity onPress={() => toggleTaskCompletion(task.id)}>
      <Text style={[styles.taskText, task.completed && styles.completedTask]}>
        {task.text}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => deleteTask(task.id)}>
      <Text style={styles.deleteButton}>X</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
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
  deleteButton: {
    color: '#FF5C5C',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default TaskItem;
