import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import firestore from '@react-native-firebase/firestore';
import BrovitechInput from '../custom-components/BrovitechInput';
import BrovitechButton from '../custom-components/BrovitechButton';
import {useDispatch} from 'react-redux';
import {updateTodo, updateTodoinFirestore} from '../store/todoSlice';

const Detail = ({route}) => {
  const [todo, setTodo] = useState(route?.params?.item?.text); //route?.params?.item?.actionToDo  for firebase
  const navigation = useNavigation();
  const CollectionRef = firestore().collection('todos');
  const docid = route?.params?.item?.id;
  const createdAt = route?.params?.item?.createdAt;
  const dispatch = useDispatch();
  // console.log("route?.params?", route?.params?.item?.docId)
  function handleUpdateTodo() {
    // CollectionRef.doc(docid)
    //   .update({
    //     actionToDo: todo,
    //     createdAt: createdAt,
    //   })
    //   .then(() => {
    //     Toast.show('The ToDo item is updated sucessfully.');
    //     navigation.navigate('Home');
    //   })
    //   .catch(error => {
    //     Toast.show('The ToDo item was unble to update.', error);
    //   });
    // dispatch(updateTodo({id: route?.params?.item?.id, task: todo}));
    dispatch(
      updateTodoinFirestore({docId: route?.params?.item?.docId, task: todo}),
    );
    Toast.show('The ToDo item is updated sucessfully.');
    navigation.navigate('Home');
  }
  return (
    <View style={{flex: 1, width: '100%'}}>
      <View style={{paddingHorizontal: 15, marginTop: 10}}>
        <BrovitechInput
          multiline
          value={todo}
          onChangeText={value => setTodo(value)}
        />
        <BrovitechButton onPress={handleUpdateTodo}>
          Update the To do
        </BrovitechButton>
      </View>
    </View>
  );
};

export default Detail;
