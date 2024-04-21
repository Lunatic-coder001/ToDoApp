import firestore from '@react-native-firebase/firestore';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoadinng: false,
  tasks: [],
  isError: null,
};
const CollectionRef = firestore().collection('todos');

export const addTodoToFirestore = createAsyncThunk(
  'todoSlice/addTodoToFirestore',
  async task => {
    // console.log("addTodoToFirestore")
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
    const response = await CollectionRef.orderBy('id', 'desc')
      .get()
      .then(snapshot => {
        // console.log("snapshot",snapshot)
        const list = [];
        snapshot.forEach(doc => {
          if (doc?.data()) {
            list.push({...doc.data(), docId: doc.id});
          }
        });
        // console.log('list', list);
        return list;
      })
      .catch(err => {
        console.log('error');
        throw err;
      });
    return response;
  },
);

export const updateTodoinFirestore = createAsyncThunk(
  'todoSlice/updateTodoinFirestore',
  async ({docId, task}) => {
    // console.log('updarte', task, docId);
    const response = await CollectionRef.doc(docId)
      .update({text: task})
      .then(() => console.log('upadted'))
      .catch(error => console.log(error));
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

export const toggleFavouriteinFirestore = createAsyncThunk(
  'todoSlice/toggleFavoutiteinFirestore',
  async ({docId, favourite}) => {
    CollectionRef.doc(docId)
      .update({favourite: !favourite})
      .then(() => console.log('favourite Updated'))
      .catch(error => console.log('error', error));
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
    builder.addCase(addTodoToFirestore.pending, (state, action) => {
      state.isLoadinng = true;
    });
    builder.addCase(addTodoToFirestore.fulfilled, (state, action) => {
      state.isLoadinng = false;
    });
    builder.addCase(addTodoToFirestore.rejected, (state, action) => {
      state.isLoadinng = false;
      state.isError = action?.error?.message;
    });
    builder.addCase(readTodoFromFirestore.pending, (state, action) => {
      state.isLoadinng = true;
    });
    builder.addCase(readTodoFromFirestore.fulfilled, (state, action) => {
      // console.log('response', action.payload);
      state.isLoadinng = false;
      state.tasks = action?.payload;
    });
    builder.addCase(readTodoFromFirestore.rejected, (state, action) => {
      console.log('error', action?.error?.message);
      state.isLoadinng = false;
      state.isError = action?.payload;
    });
    builder.addCase(updateTodoinFirestore.pending, state => {
      state.isLoadinng = true;
    });
    builder.addCase(updateTodoinFirestore.fulfilled, (state, action) => {});
    builder.addCase(updateTodoinFirestore.rejected, state => {
      (state.isLoadinng = false), (state.isError = action?.error?.message);
    });
    builder.addCase(toggleFavouriteinFirestore.fulfilled, (state, action) => {
      console.log('Favourite success');
    });
    builder.addCase(toggleFavouriteinFirestore.rejected, (state, action) => {
      console.log('error favouritre', action?.error?.message);
    });
    builder.addCase(deleteTodoinFirestore.fulfilled, (state, action) => {
      console.log('deleteFulfilled');
    });
    builder.addCase(deleteTodoinFirestore.rejected, (state, action) => {
      console.log('deleterejected ', action?.error?.message);
    });
  },
});

export const {addTodo, deleteTodo, toggleFavourite, updateTodo} =
  todoSlice.actions;
export default todoSlice.reducer;
