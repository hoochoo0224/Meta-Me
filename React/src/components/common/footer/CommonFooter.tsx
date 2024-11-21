import { Link } from 'react-router-dom'
import styles from './CommonFooter.module.scss'

const CommonFooter = () => {
    return (
        <footer className={styles.footer}>
            <Link to="/make-profile">
                <img src="/src/assets/icons/pen-solid.svg" alt="" className={styles.footer_icon} />
            </Link>
            <img src="/src/assets/icons/user-solid.svg" alt="" className={styles.footer_icon} />
            <img src="/src/assets/icons/gear-solid.svg" alt="" className={styles.footer_icon} />
        </footer>
    )
}

export default CommonFooter