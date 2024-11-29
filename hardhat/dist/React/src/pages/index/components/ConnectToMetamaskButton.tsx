import styles from './ConnectToMetamaskButton.module.scss'
import { useState } from 'react'

const ConnectToMetamaskButton = (props: { setAccount: (account: string) => void }) => {
    const [isConnecting, setIsConnecting] = useState(false);

    const connectToMetamask = async () => {        
        if (isConnecting) return;
        
        if (window.ethereum) {
            try {
                setIsConnecting(true);
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts.length > 0) {
                    localStorage.setItem('account', JSON.stringify(accounts[0]));
                    props.setAccount(accounts[0]);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsConnecting(false);
            }
        } else {
            alert('메타마스크가 설치되어 있지 않습니다.');
        }
    };

    return (
        <button 
            className={styles.button} 
            onClick={connectToMetamask}
            disabled={isConnecting}
        >
            {isConnecting ? '연결 중...' : '메타마스크로 연결'}
        </button>
    )
}

export default ConnectToMetamaskButton