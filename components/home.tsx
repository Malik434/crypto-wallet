import { StyleSheet, View, Button, Text } from 'react-native';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import 'react-native-get-random-values'
import '@ethersproject/shims'
import { ethers } from 'ethers'
import { useNavigation } from '@react-navigation/native';
// eslint-disable-next-line import/no-unresolved, import/extensions
import Account from './account'
import HomeContext from '../src/HomeContext'

const Welcome = React.memo(() => {
  const navigation = useNavigation()
  const handleNext = useCallback((goto) => {
    navigation.navigate(goto)
  }, [navigation])

  return (
    <View style={styles.subCoiner}>
      <Text style={styles.fontSize}>歡迎來到 Chrissy Wallet.</Text>
      <Button title="開始使用" onPress={() => handleNext('Register')} />
    </View>
  )
})

type HomeProps = {
  route: {
    params: {
      addr: string,
      mnem: string
    }
  }
}
export default function Home({ route }: HomeProps) {
  const [page, setPage] = useState('')
  const [balance, setBalance] = useState(0)
  const [address, setAddress] = useState('')
  const [mnemonic, setMnemonic] = useState('')
  const [sendTx, setSendTx] = useState(false)

  useEffect(() => {
    if (route.params === undefined) setPage('welcome')
    else {
      setAddress(route.params.addr)
      setMnemonic(route.params.mnem)
      setPage('account')

      const getBalance = async () => {
        try {
          const provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/ab0bba1edd7c44b28fdf159193f938f2');
          const b = await provider.getBalance(route.params.addr) // fetch the balance
          const x: number = Number(ethers.utils.formatEther(b))
          if (x < 1) setBalance(Number(x.toFixed(9)))
          else setBalance(x)
          console.log('done')
        } catch (err) {
          console.log(err)
        }
      }
      getBalance()
    }
  }, [route, sendTx])

  const foo = useMemo(() => ({ mnemonic, setSendTx }), [mnemonic]);

  return (
    <View style={styles.container}>
      { page === 'welcome' && <Welcome /> }
      <HomeContext.Provider value={foo}>
        { page === 'account' && <Account address={address} balance={balance} /> }
      </HomeContext.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  subCoiner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontSize: {
    fontSize: 19,
  },
});
