import { NativeSyntheticEvent, NativeScrollEvent, SafeAreaView, Image, FlatList, StatusBar, StyleSheet, View, Text, ScrollView, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import { ethers } from 'ethers'
import Account from './account'
import HomeContext from '../src/HomeContext'
import Transactions from './Transactions'; // Import the Transactions component

const {width,height}=Dimensions.get('window');
  const COLORS = {primary:'#282534',white:'#fff'};
  interface Item {
    image: any; // Use specific type for your image, e.g., ImageSourcePropType
    title: string;
    subtitle: string;
  }
  const slides = [
    {
      id: '1',
      image: require('../images/image1.png'),
      title: 'Your Personal ETH Wallet',
      subtitle: "It's secure and support hundred of Cryptocurrencies",
    },
    {
      id: '2',
      image: require('../images/image2.png'),
      title: 'Connect With DAPPs',
      subtitle: 'Get connected with your favorite Decenetralized applications',
    },
    {
      id: '3',
      image: require('../images/image3.png'),
      title: 'Track your Tokens',
      subtitle: 'Track and verify all your transactions on ETH Chain',
    },
  ];
  
  const Slide: React.FC<{ item: Item }> = ({ item }) => {
    return (
      <View style={{alignItems: 'center'}}>
        <Image
          source={item?.image}
          style={{height: '75%', width, resizeMode: 'contain'}}
        />
        <View>
          <Text style={Wstyles.title}>{item?.title}</Text>
          <Text style={Wstyles.subtitle}>{item?.subtitle}</Text>
        </View>
      </View>
    );
  };

  const Wstyles = StyleSheet.create({
    subtitle: {
      color: COLORS.white,
      fontSize: 13,
      marginTop: 10,
      maxWidth: '70%',
      textAlign: 'center',
      lineHeight: 23,
    },
    title: {
      color: COLORS.white,
      fontSize: 22,
      fontWeight: 'bold',
      marginTop: 20,
      textAlign: 'center',
    },
  });

 



const Welcome = React.memo(() => {
  
  // const navigation = useNavigation()
  // const handleNext = useCallback((goto) => {
  //   navigation.navigate(goto)
  // }, [navigation])
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const ref = React.useRef<FlatList<any>>(null);
  const updateCurrentSlideIndex = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex !== slides.length && ref.current) {
      const offset = nextSlideIndex * width;
      ref.current.scrollToOffset({ offset });
      setCurrentSlideIndex(nextSlideIndex);
    }
  };
  
  const skip = () => {
    const lastSlideIndex = slides.length - 1;
    if (ref.current) {
      const offset = lastSlideIndex * width;
      ref.current.scrollToOffset({ offset });
      setCurrentSlideIndex(lastSlideIndex);
    }
  };

  const navigation = useNavigation()
  const AnotherSc = useCallback((goto) => {
    navigation.navigate(goto)
  }, [navigation])

  const Footer = () => {
    return (
      <View
        style={{
          height: height * 0.25,
          justifyContent: 'space-between',
          paddingHorizontal: 20,
        }}>
        {/* Indicator container */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
          }}>
          {/* Render indicator */}
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles3.indicator,
                currentSlideIndex == index && {
                  backgroundColor: COLORS.white,
                  width: 25,
                },
              ]}
            />
          ))}
        </View>

        {/* Render buttons */}
        <View style={{marginBottom: 20}}>
          {currentSlideIndex == slides.length - 1 ? (
            <View style={{height: 50}}>
              <TouchableOpacity
                style={styles3.btn}
                onPress={() => AnotherSc('Register')}>
                <Text style={{fontWeight: 'bold', fontSize: 15}}>
                  GET STARTED
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles3.btn,
                  {
                    borderColor: COLORS.white,
                    borderWidth: 1,
                    backgroundColor: 'transparent',
                  },
                ]}
                onPress={skip}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: COLORS.white,
                  }}>
                  SKIP
                </Text>
              </TouchableOpacity>
              <View style={{width: 15}} />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={goToNextSlide}
                style={styles3.btn}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                  }}>
                  NEXT
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  const styles3 = StyleSheet.create({
    subtitle: {
      color: COLORS.white,
      fontSize: 13,
      marginTop: 10,
      maxWidth: '70%',
      textAlign: 'center',
      lineHeight: 23,
    },
    title: {
      color: COLORS.white,
      fontSize: 22,
      fontWeight: 'bold',
      marginTop: 20,
      textAlign: 'center',
    },
    image: {
      height: '100%',
      width: '100%',
      resizeMode: 'contain',
    },
    indicator: {
      height: 2.5,
      width: 10,
      backgroundColor: 'grey',
      marginHorizontal: 3,
      borderRadius: 2,
    },
    btn: {
      flex: 1,
      height: 50,
      borderRadius: 5,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "black"}}>
      <StatusBar backgroundColor={"black"} />
      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        contentContainerStyle={{height: height * 0.75}}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={slides}
        pagingEnabled
        renderItem={({item}) => <Slide item={item} />}
      />
      <Footer />
    </SafeAreaView>
  )
})

  
  // return (
  //   <View style={styles.subCoiner}>
  //   <Text style={styles.fontSize}>Welcome to Crypto Wallet.</Text>
  //   <TouchableOpacity style={styles.button} onPress={() => handleNext('Register')}>
  //     <Text style={styles.buttonText}>Start Using</Text>
  //   </TouchableOpacity>
  //   </View>
    // <View style={{
    //   flex:1,
    //   justifyContent:'center'
    // }}>
    //   <Text>Hello</Text>
    // </View>
//   )
// })

type HomeProps = {
  route: {
    params: {
      address: string,
      mnemonic: string
    }
  }
}

type Transaction = {
  description: string;
  amount: string;
};
// type AccountProps = {
//   address: string;
//   balance: number;
//   onDeleteAccount: () => void; // Prop function to handle account deletion
// };

// const Account: React.FC<AccountProps> = ({ address, balance, onDeleteAccount }) => {
//   const navigation = useNavigation();
//   const handleDelete = useCallback(() => {
//     onDeleteAccount();
//     navigation.goBack();
//   }, [onDeleteAccount, navigation]);
// // Function to confirm account deletion
// const confirmDelete = () => {
//   Alert.alert(
//     "Delete Account",
//     "Are you sure you want to delete this account?",
//     [
//       {
//         text: "Cancel",
//         style: "cancel"
//       },
//       { text: "OK", onPress: () => onDeleteAccount() }
//     ]
//   );
// };

const Home = ({ route }: HomeProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]); // Placeholder transactions state
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState('')
  const [balance, setBalance] = useState(0)
  const [address, setAddress] = useState('')
  const [mnemonic, setMnemonic] = useState('')
  const [sendTx, setSendTx] = useState(false)

  const fetchBalance = async (address: string) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/c6b0ac80ab224facb9c0ef74a0c87d63');
      const b = await provider.getBalance(address); // fetch the balance
      const x = Number(ethers.utils.formatEther(b));
      if (x < 1) setBalance(Number(x.toFixed(9)));
      else setBalance(x);
      console.log('Balance fetched');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (route.params === undefined) setPage('welcome');
    else {
      setAddress(route.params.address);
      setMnemonic(route.params.mnemonic);
      setPage('account');
      fetchBalance(route.params.address);
    }
  }, [route, sendTx]);
  
  const fetchTransactions = async () => {
    // Simulate fetching transactions data
    const fetchedTransactions = [
      { description: 'Transaction 1', amount: '1 ETH' },
      { description: 'Transaction 2', amount: '0.5 ETH' },
    ];
    setTransactions(fetchedTransactions);
  };
  useEffect(()=>{
    fetchTransactions();},
  []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (address) {
      await fetchBalance(address);
    } else {
      setPage('welcome'); // Fallback action if no address is available
    }
    setRefreshing(false);
  }, [address]);
  
  const contextValue = useMemo(() => ({ mnemonic, setSendTx }), [mnemonic]);
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {page === 'welcome' && <Welcome />}
      <HomeContext.Provider value={{ mnemonic, setSendTx }}>
        {page === 'account' && <Account address={address} balance={balance} />}
      </HomeContext.Provider>
      {/* <Transactions transactions={transactions} /> */}
    </ScrollView>
  );
}
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5', // Light grey background for a subtle texture
    //paddingVertical: 20,
    //paddingHorizontal: 15,
  },
  subCoiner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10, // Rounded corners for the card
    shadowColor: '#000', // Shadow for depth
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fontSize: {
    fontSize: 24, // Larger font size for the welcome message
    fontWeight: 'bold', // Bold font weight for emphasis
    color: '#333333', // Dark grey for better readability
    marginBottom: 20, // Space before the button
  },
  button: {
    backgroundColor: '#4E9F3D', // Green background for the primary action
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5, // Rounded corners for the button
  },
  buttonText: {
    color: '#FFFFFF', // White text for contrast
    fontSize: 18, // Slightly larger font size for the button text
    fontWeight: 'bold', // Bold font weight for the button text
  },
});