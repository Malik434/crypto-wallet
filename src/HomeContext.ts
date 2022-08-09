import React from 'react';

type HomeContextType = {
    mnemonic: string,
    setSendTx: React.Dispatch<React.SetStateAction<boolean>>
}

const HomeContext = React.createContext<HomeContextType>({} as any)

export default HomeContext
