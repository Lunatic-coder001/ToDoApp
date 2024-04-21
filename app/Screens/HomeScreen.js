import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Toast from 'react-native-simple-toast';
import firestore from '@react-native-firebase/firestore';
import BrovitechInput from '../custom-components/BrovitechInput';
import BrovitechButton from '../custom-components/BrovitechButton';
import {useNavigation} from '@react-navigation/native';
import {IconButton, MD3Colors} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {
  addTodo,
  addTodoToFirestore,
  deleteTodo,
  deleteTodoinFirestore,
  readTodoFromFirestore,
  toggleFavourite,
  toggleFavouriteinFirestore,
} from '../store/todoSlice';

const Item = item => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // console.log(item);
  function handleEditTodo() {
    navigation.navigate('EditTask', {item});
  }
  function handleDeleteTodo(id) {
    firestore()
      .collection('todos')
      .doc(id)
      .delete()
      .then(() => {})
      .catch(error => {
        console.log('Unable to delete', error);
      });
  }

  return (
    <View style={styles.item}>
      <View style={{width: '60%', alignSelf: 'center'}}>
        <Text style={styles.title}>{item.text}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
        }}>
        <IconButton
          icon="heart"
          iconColor={item.favourite ? MD3Colors.error50 : '#fff'}
          // onPress={() => handleEditFavourite()}
          onPress={() =>
            dispatch(
              toggleFavouriteinFirestore({
                docId: item.docId,
                favourite: item.favourite,
              }),
            )
          }
        />
        <IconButton
          icon="pencil"
          iconColor="#000"
          onPress={() => handleEditTodo()}
        />
        <IconButton
          icon="trash-can"
          iconColor="#000"
          // onPress={() => handleDeleteTodo(item.id)}
          onPress={() => dispatch(deleteTodoinFirestore(item.docId))}
        />
      </View>
    </View>
  );
};

const MytodoList = ({data}) => {
  // console.log('data', data);
  return (
    <View style={{flex: 1}}>
      {data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={({item}) => <Item {...item} />}
          keyExtractor={item => item.id}
        />
      ) : (
        <View style={styles.emptyView}>
          <Text style={styles.title}>Add To do to seach</Text>
        </View>
      )}
    </View>
  );
};

const MemoizedTodoList = React.memo(MytodoList);
const HomeScreen = () => {
  const [task, setTask] = useState('');
  const [search, setSearch] = useState('');
  const TodoListinRedux = useSelector(state => state.todohu.tasks);
  const [filteredTodolist, setFilteredTodolist] = useState(TodoListinRedux);
  const CollectionRef = firestore().collection('todos');
  const isLoading = useSelector(state => state.todohu.isLoadinng);
  console.log('isloading', isLoading);
  console.log('TodoListinRedux', TodoListinRedux, filteredTodolist);

  const dispatch = useDispatch();
  useEffect(() => {
    console.log('useEffect1');
    const unsubscribe = CollectionRef.onSnapshot(querySnapshot => {
      console.log('onSnapshot');
      dispatch(readTodoFromFirestore());
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log('useEffect2');
    if (TodoListinRedux.length) {
      setFilteredTodolist(
        TodoListinRedux.filter(todo =>
          todo.text.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }
  }, [search]);

  async function handleAddToDo() {
    console.log('handleAddToDoFxn');
    if (!task) {
      Alert.alert('Info', 'Your to do Task cannot be empty');
      return;
    }
    dispatch(addTodoToFirestore(task));
    // dispatch(addTodo(task))
    setTask('');
    Keyboard.dismiss();
  }
  return (
    <View style={{flex: 1, width: '100%'}}>
      <View style={{paddingHorizontal: 15}}>
        <BrovitechInput
          label="Add To do task"
          showLabel
          multiline
          placeholder="I will play..."
          value={task}
          onChangeText={value => setTask(value)}
        />
        <BrovitechButton onPress={handleAddToDo}>
          After adding click me
        </BrovitechButton>
      </View>
      <View style={{paddingHorizontal: 15, marginTop: 10}}>
        <BrovitechInput
          multiline
          placeholder="Search for todo task..."
          value={search}
          onChangeText={value => setSearch(value)}
        />
        {console.log('render')}
      </View>
      {isLoading ? <ActivityIndicator size="large" /> : null}
      <MemoizedTodoList data={filteredTodolist} />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9c2ff',
    padding: 4,
    marginVertical: 4,
    // marginHorizontal: 10,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    width: '100%',
    borderRadius: 4,
    borderWidth: 1,
  },
  title: {
    fontSize: 25,
    color: '#000',
    fontFamily: 'Poppins-Italic',
  },
  emptyView: {
    backgroundColor: 'lightblue',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
