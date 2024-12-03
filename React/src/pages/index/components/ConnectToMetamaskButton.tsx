import { useState } from 'react';
import styles from './ConnectToMetamaskButton.module.scss'

const ConnectToMetamaskButton = (props: { setAccount: (account: string) => void }) => {
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const [account, setAccount] = useState<string>('');

    const connectToMetamask = async () => {
        if (isConnecting) return;
        setIsConnecting(true);
        try {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });

                localStorage.setItem('account', JSON.stringify(accounts?.[0]));
                props.setAccount(accounts?.[0]);
            }
            else {
                localStorage.setItem('account', JSON.stringify(account));
                props.setAccount(account);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsConnecting(false);
        }
    }

    const onChangeAccount = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setAccount(e.target.value.replace(/[^a-zA-Z0-9]/g, ''));
    }

    return (
        <div className={styles.container}>
            {!window.ethereum && <input type='text' onChange={onChangeAccount} className={styles.container_input}></input>}
            <button 
                className={styles.container_button} 
                onClick={connectToMetamask}
                disabled={isConnecting}
            >
                {isConnecting ? '연결 중...' : '메타마스크로 연결'}
            </button>
        </div>
    )
}

export default ConnectToMetamaskButton