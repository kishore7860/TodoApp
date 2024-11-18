import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTasksToStorage = async (tasks) => {
  try {
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks.', e);
  }
};

export const loadTasksFromStorage = async () => {
  try {
    const savedTasks = await AsyncStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch (e) {
    console.error('Failed to load tasks.', e);
    return [];
  }
};
