import styles from './ConnectToMetamaskButton.module.scss'
import {contract, web3} from '../contract'

const ConnectToMetamaskButton = () => {
    const connectToWallet = async () => {
        const account = await web3.eth.getAccounts()[0];
        
    }

    return (
        <button className={styles.button}>
            메타마스크로 연결
        </button>
    )
}

export default ConnectToMetamaskButton