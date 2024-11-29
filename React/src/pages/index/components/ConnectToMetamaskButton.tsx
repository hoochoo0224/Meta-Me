import { useState } from 'react';
import styles from './ConnectToMetamaskButton.module.scss'

const ConnectToMetamaskButton = (props: { setAccount: (account: string) => void }) => {
    const [isConnecting, setIsConnecting] = useState<boolean>(false);

    const connectToMetamask = async () => {
        if (isConnecting) return;
        setIsConnecting(true);
        try {
            const accounts = window.ethereum.request({
                method: "eth_requestAccounts",
            });

            if (window.ethereum) {
                localStorage.setItem('account', JSON.stringify(accounts?.[0]));
                props.setAccount(accounts?.[0]);
            } else {
                alert("메타마스크가 설치되어 있지 않습니다.")
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsConnecting(false);
        }
    }

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