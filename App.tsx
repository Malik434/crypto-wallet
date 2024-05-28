import React, { useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity
 } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';

import { CreateScreen, CreateScreen2 } from './components/create'
import ImportScreen from './components/import'
import HomeScreen from './components/home'

const RenderRegister = React.memo(() => {
  const navigation = useNavigation()
  const handleNext = useCallback((goto) => {
    navigation.navigate(goto)
  }, [navigation])

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>First time visiting Crypto Wallet?</Text>
      </View>
      <View style={styles.flex}>
        <View style={styles.box}>
          <Text style={styles.boxText}>I'm a new user, create a wallet</Text>
          <Text style={styles.boxSubText}>Create a new Wallet</Text>
          <TouchableOpacity style={styles.button} onPress={() => handleNext('Create')}>
            <Text style={styles.buttonText}>Okay, let's get started!</Text>
          </TouchableOpacity>
          </View>
          <View style={styles.box}>
            <Text style={styles.boxText}>No, I already have a Secret Recovery Phrase</Text>
            <Text style={styles.boxSubText}>Import your Secret Recovery Phrase</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleNext('Import')}>
              <Text style={styles.buttonText}>Import Wallet</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  )
})
const renderCloseIcon = () => (
  <View style={styles.closeIcon}>
    <MaterialIcons name="close" size={24} color="#007AFF" />
  </View>
)

//-------------

const RootStack = createStackNavigator<RootStackParams>();
const CreateStack = createStackNavigator();
const Register = createStackNavigator();
const ImportStack = createStackNavigator();

const RegisterStackScreen = React.memo(() => (
  <Register.Navigator screenOptions={{ title: ' ' }}>
    <Register.Screen name="RegisterScreen" component={RenderRegister} options={{ headerTransparent: false, headerBackTitle: ' '}} />
  </Register.Navigator>
))
const CreateStackScreen = React.memo(() => (
  <CreateStack.Navigator screenOptions={{ title: 'Create Wallet' }}>
    {/* headerShown: false, ...createStackNavigator.ModalPresentationIOS */}
    <CreateStack.Screen name="Create1" component={CreateScreen} options={{ headerBackTitle: ' '}} />
    <CreateStack.Screen name="Create2" component={CreateScreen2} options={{ headerBackTitle: '' }} />
  </CreateStack.Navigator>
))
const ImportStackScreen = React.memo(() => (
  <ImportStack.Navigator screenOptions={{ title: 'Import Wallet' }}>
    <ImportStack.Screen name="ImportScreen" component={ImportScreen} options={{ headerBackTitle: ' ' }} />
  </ImportStack.Navigator>
))

export type RootStackParams = {
  Home: {
    address: string
    mnemonic: string
  }
  Register: undefined
  Create: undefined
  Create2: {
    address: string
    mnemonic: string
  }
  Import: undefined
}
const App = () => (
  <NavigationContainer>
    <RootStack.Navigator>
      <RootStack.Screen 
      name="Home" 
      component={HomeScreen}
       options={{
         title: 'My Wallet',
         headerShown:false,
        // headerBackTitle: '',
      //  headerTintColor:'white',
      //  headerTitleAlign:'center',

        // headerStyle:{
        //   backgroundColor:'#007FFF',
          
        // }

       }}/>
      <RootStack.Screen name="Register" component={RegisterStackScreen} options={{ headerShown: false, presentation: 'modal' }} />
      <RootStack.Screen name="Create" component={CreateStackScreen} options={{ headerShown: false, presentation: 'modal' }} />
      <RootStack.Screen name="Import" component={ImportStackScreen} options={{ headerShown: false, presentation: 'modal' }} />
    </RootStack.Navigator>
  </NavigationContainer>
)
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black', // dark background color
  },
  flex: {
    flex: 5,
  },
  title: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  titleText: {
    color: '#ffffff', // white color for better contrast on dark background
    fontSize: 25,
    fontWeight: '500',
  },
  box: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    height: 185,
    width: 280,
    borderWidth: 1,
    borderColor: '#ffffff', // white border for better contrast on dark background
    borderRadius: 8,
    backgroundColor: '#003262', // slightly lighter dark color for the box
  },
  boxText: {
    fontSize: 19,
    fontWeight: '500',
    color: '#ffffff', // white color for better contrast on dark background
  },
  boxSubText: {
    paddingVertical: 13,
    fontSize: 16,
    textAlign: 'center',
    color: '#a0a0a0', // lighter gray color for better contrast on dark background
  },
  closeIcon: {
    
    paddingLeft: 10,
    color: '#ffffff', // white color for better contrast on dark background
  },
  button: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  closeIconContainer: {
    backgroundColor: '#000000',
  },
});