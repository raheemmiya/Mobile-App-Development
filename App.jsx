import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from "react-native";

export default function App() {
  const [task, setTask] = useState("");           // Stores text user types
  const [tasks, setTasks] = useState([]);         // Stores list of tasks

  // Add new task
  const addTask = () => {
    if (task.trim() !== "") {                     // If not empty
      setTasks([...tasks, { id: Date.now().toString(), text: task }]);
      setTask("");                                // Clear input after adding
    }
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 My To-Do List</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a new task..."
        value={task}
        onChangeText={setTask}
      />

      <Button title="Add Task" onPress={addTask} />

      <FlatList
        style={styles.list}
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => deleteTask(item.id)}>
            <Text style={styles.item}>• {item.text}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  list: {
    marginTop: 20,
  },
  item: {
    fontSize: 18,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 8,
    borderRadius: 8,
  },
});
