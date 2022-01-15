import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';

import { contractABI, contractAdress } from '../utils/constants';

// create context to provide eth functions to all components
export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAdress, contractABI, signer);

    console.log({
        provider,
        signer,
        transactionContract
    });
}

export const TransactionProider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('');

    const installMetaMaskMessage = () => {
        if (!ethereum) {
            if (confirm('You need to instal metamask. Click "ok" to do that')) {
                window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn');
            }
            return false;
        }
        return true;
    }

    /**
     *  check if the wallet is connected and try to get connected account
     */
    const checkIfWalletIsConnected = async () => {
        try {
            if (!installMetaMaskMessage()) return;
   
            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);

                // getAllTransactions(); 
            } else {
                console.log('No account found');
            }
        } catch (error) {
            console.log(error);
            throw new Error('No ethereum object');
        }
    }

    /**
     * try to connect metamask wallet and provide it to all components
     */
    const connectWallet = async () => {
        try {
            if (!installMetaMaskMessage()) return;

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
            throw new Error('No ethereum object');
        }
    }
    
    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    // wrap children to context provider
    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount }}>
            {children}
        </TransactionContext.Provider>
    )
}