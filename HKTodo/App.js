import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { theme } from './colors';
import { useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  useEffect(() => {
    loadToDos();
  }, []);
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    console.log(toSave);
    console.log(JSON.stringify(toSave));
    };
  const loadToDos = async () => {
    const s = AsyncStorage.getItem(STORAGE_KEY);
    if(s === null){
      return null;
    }
    else {
      console.log(s);
    }
  };
  const onChangeText = (payload) => setText(payload);
  const addToDo = async () => {
    if(text===""){
      return;
    }
    const newToDos = {...toDos, [Date.now()] : {text, working}}
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working? "white" : theme.grey,}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: !working? "white" : theme.grey,}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        returnKeyType='done'
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        value={text}
        placeholder={working? "Add a To Do": "Add a To Go"} 
        style={styles.input}/>
      <ScrollView style={styles.toDoList}>
          {Object.keys(toDos).map((key) => 
          toDos[key].working === working ? 
          <View style={styles.toDo} key={key}>
            <Text style={styles.toDoText}> {toDos[key].text}</Text>
          </View> : null
          )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal:30,
  },
  header:{
    justifyContent:'space-between',
    flexDirection:"row",
    marginTop:100,

  },
  btnText:{
    fontSize:40,
    fontWeight:"500",
  },
  input:{
    marginTop:20,
    backgroundColor:"white",
    paddingVertical:10,
    paddingHorizontal:20,
    borderRadius:30,
  },
  toDoList:{
  },
  toDo:{
    backgroundColor:theme.toDoBg,
    marginTop:10,
    paddingVertical:20,
    paddingHorizontal:40,
    borderRadius:20,

  },
  toDoText:{
    color:"white",
    fontSize: 16,
    fontWeight:"500",
  },
});
