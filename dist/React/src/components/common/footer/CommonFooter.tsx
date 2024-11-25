import { Link } from 'react-router-dom'
import styles from './CommonFooter.module.scss'

interface CommonFooterProps {
    activePage: string;
}

const CommonFooter = ({ activePage }: CommonFooterProps) => {
    return (
        <footer className={styles.footer}>
            <Link to="/make-profile">
                {
                    activePage === 'make-profile' ? (
                        <img src="/src/assets/icons/pen-to-square-solid.svg" alt="" className={styles.footer_icon} />
                    ) : (
                        <img src="/src/assets/icons/pen-to-square-regular.svg" alt="" className={styles.footer_icon} />
                    )
                }
            </Link>
            <Link to="/">
                {activePage === 'index' ? (
                    <img src="/src/assets/icons/user-solid.svg" alt="" className={styles.footer_icon} />
                ) : (
                    <img src="/src/assets/icons/user-regular.svg" alt="" className={styles.footer_icon} />
                )}
            </Link>
            <Link to="/settings">
                <img src="/src/assets/icons/list-solid.svg" alt="" className={styles.footer_icon} />
            </Link>
        </footer>
    )
}

export default CommonFooter