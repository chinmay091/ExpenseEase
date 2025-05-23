import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, FlatList, TouchableOpacity } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import goalApi from '../../services/pluggy/apiAdapter';

const GoalsScreen = () => {
  const [goals, setGoals] = useState([]);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalIcon, setGoalIcon] = useState('star');
  const [goalBudget, setGoalBudget] = useState('');

  const availableIcons = [
    'star', 'beach-access', 'directions-car', 'bike-scooter', 'wallet-travel', 'flight-takeoff', 
    'money', 'home', 'shopping-cart', 'restaurant-menu', 'fitness-center', 'spa', 'favorite', 'attach-money'
  ];

  // Fetch goals on component mount
  const loadGoals = async () => {
    try {
      const goalsData = await goalApi.get('goals/');
      const goalsList = goalsData.data || goalsData;
      setGoals(goalsList);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch goals.');
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  // Add a new goal
  const addGoal = async () => {
    if (!goalTitle || !goalBudget || !goalIcon) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const newGoal = {
      title: goalTitle,
      icon: goalIcon,
      budget: parseFloat(goalBudget),
      progress: 0,
    };

    try {
      const createdGoal = await goalApi.post('goals/', newGoal);
      setGoals((prevGoals) => [...prevGoals, createdGoal.data]);
      setGoalTitle('');
      setGoalIcon('star');
      setGoalBudget('');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to create goal.');
    }
  };

  // Update goal progress
  const updateProgress = async (goalId) => {
    const progressIncrement = 1000;

    try {
      const response = await goalApi.post(`goals/${goalId}/update-progress/`, { progress: progressIncrement });
      const updatedGoal = response.data;

      const updatedGoals = goals.map((goal) =>
        goal.id === goalId ? updatedGoal : goal
      );
      loadGoals();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update goal progress.');
    }
  };

  // Delete a goal
  const deleteGoal = async (goalId) => {
    try {
      await goalApi.deleteGoal(goalId);
      const updatedGoals = goals.filter((goal) => goal.id !== goalId);
      setGoals(updatedGoals);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete goal.');
    }
  };

  const renderGoalCard = ({ item }) => (
    <View style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <View style={styles.iconBox}>
          <Icon name={item.icon} size={30} color="#FFFFFF" />
        </View>
        <Text style={styles.goalTitle}>{item.title}</Text>
      </View>
      <Text style={styles.goalProgressText}>
        Progress: {item.progress} / {item.budget}
      </Text>
      <ProgressBar progress={item.budget > 0 ? item.progress / item.budget : 0} color="#6200ea" style={styles.progressBar} />
      <View style={styles.buttonRow}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => updateProgress(item.id)}
      >
        <Text style={[styles.buttonText, { backgroundColor: '#00A8A1' }]}>+ ₹1000</Text>
      </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => deleteGoal(item.id)}
        >
          <Text style={[styles.buttonText, { backgroundColor: '#D32F2F' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Set Your Financial Goals</Text>
      <TextInput
        style={styles.input}
        placeholder="Goal Title"
        value={goalTitle}
        onChangeText={setGoalTitle}
      />
      <View style={styles.iconButtonContainer}>
      <Text style={styles.iconLabel}>Select an Icon:</Text>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => {
          const currentIndex = availableIcons.indexOf(goalIcon);
          const nextIndex = (currentIndex + 1) % availableIcons.length;
          setGoalIcon(availableIcons[nextIndex]);
        }}
      >
        <Icon name={goalIcon} size={50} color="#fff" />
      </TouchableOpacity>
    </View>

      <TextInput
        style={styles.input}
        placeholder="Budget Required"
        keyboardType="numeric"
        value={goalBudget}
        onChangeText={setGoalBudget}
      />
      <TouchableOpacity style={styles.addGoalButton} onPress={addGoal}>
        <Text style={styles.addGoalButtonText}>Add Goal</Text>
      </TouchableOpacity>

      <FlatList
        data={goals}
        renderItem={renderGoalCard}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#284D63',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 15,
    color: '#000',
  },
  iconLabel: {
    fontSize: 16,
    marginTop: 8,
    color: '#fff',
    textAlign: 'center',
  },
  iconButton: {
    marginTop: 10,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#284D63',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'white',
    width: 80,
    height: 80,
    marginHorizontal: 125,
  },
  iconBox: {
    backgroundColor: '#00A8A1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  goalCard: {
    marginTop: 15,
    marginBottom: 5,
    padding: 9,
    borderWidth: 1,
    borderColor: '#00A8A1',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  goalTitle: {
    fontSize: 18,
    marginLeft: 8,
    color: '#284D63',
    fontWeight: '600',
  },
  goalProgressText: {
    fontSize: 14,
    marginTop: 5,
    color: '#3C6E71',
  },
  progressBar: {
    height: 8,
    marginTop: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  addGoalButton: {
    backgroundColor: '#00A8A1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  addGoalButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  button: {
    paddingVertical: 8, 
    paddingHorizontal: 50, 
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',  
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    padding: 8,
  },
};

export default GoalsScreen;
