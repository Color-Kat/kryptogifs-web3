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
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount') ?? []);
    const [transactions, setTransactions] = useState(localStorage.getItem('transactions') ?? []);

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

                getAllTransactions(); 
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

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', // 21000 GWEI
                    value: parsedAmount._hex
                }]
            });
            
            const transactionHash = await transactionContract.addToBlockchain( addressTo, parsedAmount, message, keyword);
           
            setIsLoading(true);

            await transactionHash.wait();

            setIsLoading(false);

            const transactionCount = await transactionContract.getTransactionsCount();

            setTransactionCount(transactionCount.toNumber());
            getAllTransactions();
        } catch (error) {
            console.log(error);
            throw new Error('No ethereum object');
        }
    }

    const checkIfTransactionsExists = async () => {
        try {
            const transactionContract = getEthereumContract();
            
            const transactionCount = await transactionContract.getTransactionsCount();

            window.localStorage.setItem("transactionCount", transactionCount);
        } catch (error) {
            console.log(error);
            throw new Error('No ethereum object');
        }
    }

    const getAllTransactions = async () => {
        try {
            if (!installMetaMaskMessage()) return;

            const transactionContract = getEthereumContract();
            const availableTransactions = await transactionContract.getAllTransactions();

            const structuredTransactions = availableTransactions.map(transaction => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18)
            }));
        

            setTransactions(structuredTransactions);
            
            // console.log(availableTransactions, structuredTransactions);
        } catch (error) {
            console.log(error);
            throw new Error('No ethereum object');
        }
    }
    
    // try to connect metamask wallet on mount 
    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExists();
    }, []);


    // wrap children to context provider
    return (
        <TransactionContext.Provider value={{
            connectWallet,
            currentAccount,
            formData,
            setFormData,
            onFormChange,
            sendTransaction,
            transactionCount,
            transactions,
            isLoading
        }}>
            {children}
        </TransactionContext.Provider>
    )
}