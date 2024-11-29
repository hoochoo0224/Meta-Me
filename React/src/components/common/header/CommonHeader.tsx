import { useEffect } from 'react';
import styles from './CommonHeader.module.scss'
import logoIcon from '/src/assets/icons/hive-brands-solid.svg'

const CommonHeader = (props: { account: string | null, setAccount: (account: string | null) => void }) => {
    useEffect(() => {
        const handleAccountsChanged = async (accounts: string[]) => {
            if (accounts.length === 0) {
                localStorage.removeItem('account');
                props.setAccount(null);
            } else {
                localStorage.setItem('account', JSON.stringify(accounts[0]));
                props.setAccount(accounts[0]);
            }
        };

        const handleDisconnect = () => {
            localStorage.removeItem('account');
            props.setAccount(null);
        };

        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_accounts' })
                .then(handleAccountsChanged)
                .catch(console.error);

            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on("disconnect", handleDisconnect);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener("disconnect", handleDisconnect);
            }
        };
    }, [props.account]);
    
    return (
        <header className={styles.header}>
            <img src={logoIcon} alt="" className={styles.header_logo} />
            <span className={styles.header_title}>Meta Me</span>
        </header>
    )
}

export default CommonHeader