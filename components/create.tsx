/* eslint-disable react/no-array-index-key */
import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, Alert, Clipboard, ScrollView } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import 'react-native-get-random-values'
import '@ethersproject/shims'
import { ethers } from 'ethers';

import { RootStackParams } from '../App'

export const CreateScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>()
  const [declaration, setDeclaration] = useState(false)
  const [mnemonic, setMnemonic] = useState('')
  const [address, setAddress] = useState('')
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const createWallet = async () => {
      try {
        setIsLoading(true);
        const wallet = ethers.Wallet.createRandom();
        console.log(wallet)
        console.log('address:', wallet.address)
        setAddress(wallet.address)
        console.log('mnemonic:', wallet.mnemonic.phrase)
        setMnemonic(wallet.mnemonic.phrase)
        console.log('privateKey:', wallet.privateKey)
      } catch (error) {
        Alert.alert('Error', 'Failed to create wallet.');
      } finally {
        setIsLoading(false);
      }
    };
    createWallet();
  }, []);

  const handleNext = useCallback(() => {
    navigation.navigate('Create2', { address, mnemonic })
  }, [mnemonic, address, navigation])
  const handleDeclaration = useCallback(() => {
    setDeclaration(true)
  }, [setDeclaration])

  const copyToClipboard = () => {
    Clipboard.setString(mnemonic);
    Alert.alert('Copied', 'Mnemonic copied to clipboard. Be careful not to share it!');
  };

  if (isLoading) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Your Secret Recovery Phrase</Text>
      </View>
      <View style={styles.subContainer}>
        <Text style={styles.fontSize}>The mnemonic phrase will help you back up your account information in a simpler way.{'\n\n'}Warning: Never disclose your mnemonic phrase.{'\n'}Anyone who knows your mnemonic phrase can steal all your tokens.{'\n'}</Text>
        <View style={styles.phraseContainer}>
          {
            declaration ? <Text style={styles.phraseText}>{mnemonic}</Text>
              : <Text style={styles.nonPhraseText}>{mnemonic}</Text>
          }
        </View>
        <View style={styles.btn}>
          {
            declaration ? <Button onPress={() => handleNext()} title="Next" />
              : <Button onPress={handleDeclaration} title="I Understand" />
          }
        </View>
        <Button onPress={copyToClipboard} title="Copy Mnemonic" />
      </View>
    </View>
  );
}

type Create2Props = {
  route: {
    params: {
      address: string,
      mnemonic: string,
    }
  }
}
export const CreateScreen2 = ({ route }: Create2Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>()
  const phrase = route.params.mnemonic.split(' ')
  const [check, setCheck] = useState<string[]>([])
  const [errMes, setErrMes] = useState(false)

  const handleSubmit = useCallback(() => {
    let verify = true
    check.map((e, index) => {
      if (e !== phrase[index]) verify = false
      return true
    })
    if (!verify) setErrMes(true)
    else {
      navigation.goBack()
      navigation.goBack()
      navigation.navigate('Home', { address: route.params.address, mnemonic: route.params.mnemonic })
    }
  }, [check, phrase, navigation, route])

  return (
    <View style={[styles.container, styles2.container]}>
      <View style={styles2.title}>
        {
          errMes ? <Text style={[styles2.titleText, styles2.redColor]}>Mnemonic Phrase Incorrect</Text>
            : <Text style={styles2.titleText}>Confirm Your Backed Up Mnemonic Phrase</Text>
        }
      </View>
      <View style={[styles2.boxContainer, styles2.checkBoxCtner]}>
        {
          check.map((e, index) => (
            <View key={index} style={[styles2.phraseBox]}>
              <Button
                title={e}
                onPress={() => {
                  const one = check.slice(0, check.indexOf(e))
                  const two = check.slice(check.indexOf(e) + 1, check.length)
                  setCheck(() => [...one, ...two])
                  if (errMes) setErrMes(false)
                }}
              />
            </View>
          ))
        }
      </View>
      <View style={[styles2.boxContainer, styles2.phraseBoxCtner]}>
        {
          phrase.map((e, index) => {
            if (check.indexOf(e) !== -1) {
              return (
                <View key={index} style={styles2.phraseBox}>
                  <Button disabled title={e} />
                </View>
              )
            }
            return (
              <View key={index} style={styles2.phraseBox}>
                <Button
                  title={e}
                  onPress={() => {
                    setCheck((pre) => [...pre, e])
                  }}
                />
              </View>
            )
          })

        }
      </View>
      <View style={styles.btn}>
        {
          check.length === phrase.length
            ? <Button onPress={() => handleSubmit()} title="Complete" />
            : <Button disabled title="Complete" />
        }
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    backgroundColor: 'black',
  },
  title: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  titleText: {
    fontWeight: '500',
    fontSize: 32,
  },
  fontSize: {
    fontSize: 19,
  },
  subContainer: {
    flex: 4,
    paddingTop: 28,
  },
  phraseContainer: {
    flex: 4,
    justifyContent: 'center',
  },
  phraseText: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    color: 'gray',
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 10,
    borderWidth: 1,
  },
  nonPhraseText: {
    color: '#EDEDED',
    padding: 20,
    fontSize: 20,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
  },
})
const styles2 = StyleSheet.create({
  container: {
    paddingHorizontal: 40,
  },
  title: {
    alignItems: 'center',

  },
  titleText: {
    fontWeight: 'bold', 
    fontSize: 24,
    color: '#333333', //Dark Grey
  },
  boxContainer: {
    flex: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginHorizontal: 20, 
    backgroundColor: '#FFFFFF', 
    borderRadius: 10, // Rounded corners
    shadowColor: '#000', 
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  checkBoxCtner: {
    flexWrap: 'wrap',
    backgroundColor: '#F0F2F5', // Light grey background for a subtle texture, added for consistency
    padding: 5, // Padding to ensure content does not touch the edges
    borderRadius: 5, // Rounded corners for the checkbox container
  },
  checkBox: {
    backgroundColor: '#4E9F3D', // Green background for checkboxes, for consistency with button style
    color: '#FFFFFF', // White text for contrast, assuming this is a property for text color within the checkbox
    borderRadius: 5, // Rounded corners for the checkboxes
    paddingVertical: 10, // Padding for size consistency with buttons
    paddingHorizontal: 20, // Padding for size consistency with buttons
  },
  phraseBoxCtner: {
    flexWrap: 'wrap-reverse',
  },
  phraseBox: {

    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 4,
  },
  redColor: {
    color: 'red',
  },
})