import { StyleSheet, View, TouchableOpacity, Text, TextInput, Button } from 'react-native';
import React, { useState, useCallback, useContext } from 'react';

import 'react-native-get-random-values'
import '@ethersproject/shims'
import { ethers } from 'ethers';

import HomeContext from '../src/HomeContext'

type SendTxProps = {
  address: string,
  balance: number,
  setPage: React.Dispatch<React.SetStateAction<string>>,
}
const SendTransaction = ({ address, balance, setPage }: SendTxProps) => {
  const [addressTo, setAddressTo] = useState('')
  const [amount, setAmount] = useState('')
  const [verifyMes, setVerifyMes] = useState('false')
  const [transaction, setTransaction] = useState(false)
  const context = useContext(HomeContext)
  //---------------

  const handleAddrChange = useCallback((e) => {
    setAddressTo(e)
    setVerifyMes(isValidAddress(e) ? 'true' : 'false');
  }, [])
  
  const handleAmount = useCallback((e) => {
    if (e === '' || /^\d*\.?\d*$/.test(e)) {
      if (e[0] === '.' && e.length > 1) setAmount(`0${e}`) // .1 = 0.1
      else if (e.length === 2 && e === '00') setAmount('0') // 00000 -> 0
      else if (e.length === 2 && e[0] === '0' && e[1] !== '0' && e[1] !== '.') setAmount(e.slice(1, 2)) // 0123 -> 123
      else setAmount(e)
    }
  }, [])
  const handlePage = useCallback(() => {
    setPage('account')
  }, [setPage])
  const handleVerifyMes = useCallback(() => {
    setVerifyMes('null')
    setAddressTo('')
  }, [])
  const isValidAddress = useCallback((e) => {
    return e.startsWith('0x') && e.length === 42;
  }, [])
  const handleSendTx = useCallback(() => {
    const sendTx = async () => {
      setTransaction(true)
      if (amount === '' || amount === '.' || amount === '0.') setAmount('0')

      const mnemonicWallet = ethers.Wallet.fromMnemonic(context.mnemonic)
      const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/c6b0ac80ab224facb9c0ef74a0c87d63');
      const wallet = new ethers.Wallet(mnemonicWallet.privateKey, provider)

      try {
        const tx = await wallet.sendTransaction({
          to: addressTo,
          value: ethers.utils.parseEther(amount),
        })
        await tx.wait()
        context.setSendTx((pre: boolean) => !pre)
        setTransaction(false)
        setPage('account')
        console.log(tx)
      } catch (err) {
        console.log(err)
      }
    }
    sendTx()
  }, [context, setPage, amount, , addressTo])

  return (
    <View style={styles.flex}>
      <Text style={styles.titleText}>Send to</Text>
      {
        verifyMes === 'true' ? (
          <View style={styles.flex}>
            <View style={styles.addressBox}>
              {/* <Text style={styles.addressText}>{address}</Text> */}
              <Text style={styles.addressText}>{addressTo}</Text>
              <Text onPress={handleVerifyMes}>X</Text>
            </View>
            <Text style={styles.textGreen}>Wallet address detected!</Text>
            {/* ---------------- */}
            <View style={styles.flex}>
              <View style={[styles.box, styles.box1_margin]}>
                <Text style={styles.subTitle}>Assets:</Text>
                <Text style={styles.fontSize2}>{balance === 0 ? 0 : balance}  Sapolia ETH</Text>
              </View>
              <View style={[styles.box, styles.box2_margin]}>
                <Text style={styles.subTitle}>Amount:</Text>
                <TextInput
                  keyboardType="numeric"
                  onChangeText={handleAmount}
                  value={amount}
                  placeholder="0"
                  style={styles.amountText}
                />
                <Text style={styles.fontSize2}>Sapolia ETH</Text>
              </View>
              {
                Number(amount) >= balance
                  && <Text style={[styles.textRed, styles.textAlign]}>Insufficient funds</Text>
              }
            </View>
            { transaction && <Text style={styles.processText}>Processing transaction . . .</Text> }
            {/* ---------------- */}
            <View style={styles.btnContainer}>
              <TouchableOpacity
                onPress={handlePage}
                style={styles.btn}
              >
                <Text style={[styles.fontSize, styles.textBlue]}>Cancel</Text>
              </TouchableOpacity>
              {
                Number(amount) >= balance || transaction
                  ? (
                    <View style={[styles.btn, styles.disabledBtn]}>
                      <Button disabled title="Confirm" />
                    </View>
                  )
                  : (
                    <TouchableOpacity
                      onPress={handleSendTx}
                      style={[styles.btn, styles.bgColor_Blue]}
                    >
                      <Text style={[styles.fontSize, styles.textWhite]}>Confirm</Text>
                    </TouchableOpacity>
                  )
              }
            </View>
          </View>
        )
          : (
            <View>
              <TextInput
                onChangeText={handleAddrChange}
                value={addressTo}
                placeholder="Search public address (0x)"
                style={styles.addressInputBox}
              />
              <View style={styles.flexDirection}>
                <View style={styles.flex}>
                  { verifyMes === 'false' && <Text style={styles.textRed}>Invalid recipient address</Text> }
                </View>
                <Text onPress={handlePage} style={styles.cancelBtn}>Cancel</Text>
              </View>
            </View>
          )
      }
    </View>
  )
}
export default SendTransaction;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexDirection: {
    flexDirection: 'row',
  },
  fontSize: {
    fontSize: 18,
  },
  fontSize2: {
    fontSize: 19,
  },
  textAlign: {
    textAlign: 'right',
  },
  textRed: {
    color: 'red',
  },
  textGreen: {
    color: '#36BF36',
  },
  textBlue: {
    color: '#007AFF',
  },
  textWhite: {
    color: '#fff',
  },
  titleText: {
    fontSize: 23,
    fontWeight: '500',
    textAlign: 'center',
    paddingBottom: 14,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 10,
    borderColor: '#4D80E6',
    borderWidth: 1,
    borderRadius: 8,
  },
  addressText: {
    flex: 1,
    paddingRight: 10,
    color: '#4D80E6',
  },
  processText: {
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
    fontSize: 17,
    color: 'dimgray',
  },
  addressInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 10,
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  box1_margin: {
    marginTop: 45,
  },
  box2_margin: {
    marginTop: 30,
    marginBottom: 10,
  },
  subTitle: {
    fontWeight: '500',
    fontSize: 20,
  },
  amountText: {
    textAlign: 'center',
    fontSize: 17,
    width: '45%',
    marginRight: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  btn: {
    borderColor: '#007AFF',
    borderWidth: 1,
    paddingHorizontal: 58,
    paddingVertical: 8,
    borderRadius: 18,
    justifyContent: 'center',
  },
  bgColor_Blue: {
    backgroundColor: '#007AFF',
  },
  cancelBtn: {
    textAlign: 'right',
    color: '#007AFF',
    paddingVertical: 10,
    paddingLeft: 20,
  },
  disabledBtn: {
    backgroundColor: '#737373',
    borderColor: '#737373',
    paddingHorizontal: 50,
    paddingVertical: 0,
  },
});