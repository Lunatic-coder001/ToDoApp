import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, useColorScheme, View} from 'react-native';
import BrovitechInput from './app/custom-components/BrovitechInput';
import BrovitechButton from './app/custom-components/BrovitechButton';

let timer = () => {};

function App() {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    startTimer();
    return () => clearTimeout(timer);
  });
  const startTimer = () => {
    timer = setTimeout(() => {
      if (timeLeft <= 0) {
        clearTimeout(timer);
        return false;
      }
      setTimeLeft(timeLeft - 1);
    }, 1000);
  };
  const start = () => {
    setTimeLeft(60);
    clearTimeout(timer);
    startTimer();
  };

  return (
    <View style={styles.container}>
      <BrovitechInput
        showLabel
        label="Type your name below"
        placeholder="What is your name"
        // errorMessage="you entered wrong"
        editable
      />
      <View style={styles.buttonContainer}>
      <Text style={styles.timer}>{timeLeft}</Text>
        <BrovitechButton textColor="lightblue" onPress={start}>
          Press to start the timer
        </BrovitechButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: '4%',
    borderWidth:1,
  },
  buttonContainer: {
    flex: 1,
    marginTop: 10,
    width: '100%',
    marginLeft: 60,
  },
  timer: {
    fontSize: 35,
    // marginLeft: '500',
  },
});
export default App;



import firestore from '@react-native-firebase/firestore';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
// const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  isLoadinng: false,
  tasks: [],
  isError: null,
};
const CollectionRef = firestore().collection('todos');

export const addTodoToFirestore = createAsyncThunk(
  'todoSlice/addTodoToFirestore',
  async task => {
    try {
      const data = {id: Date.now(), text: task, favourite: false};
      await CollectionRef.add(data);
    } catch (error) {
      throw error;
    }
  },
);

export const readTodoFromFirestore = createAsyncThunk(
  'todoSlice/readTodoFromFirestore',
  async () => {
    const response = await CollectionRef
      .get()
      .then(snapshot => {
        console.log("snapshot",snapshot)
        const list = [];
        snapshot.forEach(doc => {
          if (doc?.data()) {
            list.push({...doc.data(), docId: doc.id});
          }
        });
        console.log('list', list);
        return list;
      })
      .catch(err => {
        console.log("error")
        throw err;
      });
    return response;
  },
);

// export const readTodoFromFirestore = createAsyncThunk(
//   'todoSlice/readTodoFromFirestore',
//   async () => {
//     try {
//       const snapshot = await CollectionRef.orderBy('id', 'desc').get();
//       console.log("snapshot", snapshot);

//       const list = [];
//       snapshot.forEach(doc => {
//         if (doc.exists) {
//           list.push({ ...doc.data(), docId: doc.id });
//         }
//       });

//       console.log('list', list);
//       return list;
//     } catch (error) {
//       throw error;
//     }
//   },
// );


export const updateTodoinFirestore = createAsyncThunk(
  'todoSlice/updateTodoinFirestore',
  async ({docId, task}) => {
    console.log('updarte', task, docId);
    await CollectionRef.doc(docId)
      .update({text: task})
      .then(() => console.log('upadted'))
      .catch(error => console.log(error));
    console.log('updarte success');
  },
);

export const deleteTodoinFirestore = createAsyncThunk(
  'todoSlice/deleteTodoinFirestore',
  async docId => {
    CollectionRef.doc(docId)
      .delete()
      .then(() => {
        console.log('deleted Succesfully');
      })
      .catch(error => {
        console.log('Error deleting', error);
      });
  },
);
const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action) => {
      state.tasks.push({
        id: Date.now(),
        text: action.payload,
        favourite: false,
      });
      state.tasks.sort((a, b) => b.id - a.id);
    },
    deleteTodo: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    toggleFavourite: (state, action) => {
      const todo = state.tasks.find(task => task.id === action.payload);
      if (todo) {
        todo.favourite = !todo.favourite;
      }
    },
    updateTodo: (state, action) => {
      const todo = state.tasks.find(task => task.id === action.payload.id);
      if (todo) {
        todo.text = action.payload.task;
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(addTodoToFirestore.pending, (state,action) => state.isLoadinng = true)
    builder.addCase(addTodoToFirestore.fulfilled, (state, action) => state.isLoadinng = false);
    builder.addCase(addTodoToFirestore.rejected, (state,action) => {state.isLoadinng = false;state.isError = action?.payload})
    builder.addCase(readTodoFromFirestore.pending,(state,action) => state.isLoadinng = true);
    builder.addCase(readTodoFromFirestore.fulfilled, (state, action) => {
      console.log('response', action.payload);
      state.isLoadinng = false;
      state.tasks = action?.payload;
    });
    builder.addCase(readTodoFromFirestore.rejected,(state,action) => {state.isLoadinng = false;state.isError = action?.payload})
    builder.addCase(updateTodoinFirestore.pending,(state) => state.isLoadinng = true)
    builder.addCase(updateTodoinFirestore.fulfilled, (state, action) => {});
    builder.addCase(updateTodoinFirestore.rejected,(state)=> {state.isLoadinng = false,state.isError = action?.payload})
  },
});

export const {addTodo, deleteTodo, toggleFavourite, updateTodo} =
  todoSlice.actions;
export default todoSlice.reducer;
