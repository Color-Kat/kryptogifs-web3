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

    // console.log({
    //     provider,
    //     signer,
    //     transactionContract
    // });
    console.log(transactionContract);
    return transactionContract;
}

export const TransactionProider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [formData, setFormData] = useState({
        addressTo: '',
        amount: '',
        keyword: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));

    const onFormChange = (e, name) => {
        setFormData(prev => ({
            ...prev, [name]: e.target.value
        }));
    }

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

    const sendTransaction = async () => {
        try {
            if (!installMetaMaskMessage()) return;

            // get form data
            const { addressTo, amount, message, keyword } = formData;

            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);

            console.log(addressTo, amount, message, keyword);

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', // 21000 GWEI
                    value: parsedAmount._hex
                }]
            });
            
            const transactionHash = await transactionContract.addToBlockchain( addressTo, +amount, message, keyword);
           
            setIsLoading(true);

            console.log("Loading - ", transactionHash);
            await transactionHash.wait();
            console.log("Success - ", transactionHash);

            const transactionCount = await transactionContract.getTransactionCount();

            setIsLoading(false);

            console.log('transactionCount: ', transactionCount);
            setTransactionCount(transactionCount.toNumber());
        } catch (error) {
            console.log(error);
            throw new Error('No ethereum object');
        }
    }
    
    // try to connect metamask wallet on mount 
    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    // wrap children to context provider
    return (
        <TransactionContext.Provider value={{
            connectWallet,
            currentAccount,
            formData,
            setFormData,
            onFormChange,
            sendTransaction
        }}>
            {children}
        </TransactionContext.Provider>
    )
}