import { Link } from 'react-router-dom'
import styles from './CommonFooter.module.scss'
import penToSquareSolid from '/src/assets/icons/pen-to-square-solid.svg'
import penToSquareRegular from '/src/assets/icons/pen-to-square-regular.svg'
import userSolid from '/src/assets/icons/user-solid.svg'
import userRegular from '/src/assets/icons/user-regular.svg'
import listSolid from '/src/assets/icons/list-solid.svg'


interface CommonFooterProps {
    activePage: string;
}

const CommonFooter = ({ activePage }: CommonFooterProps) => {
    return (
        <footer className={styles.footer}>
            <Link to="/make-profile">
                {
                    activePage === 'make-profile' ? (
                        <img src={penToSquareSolid} alt="" className={styles.footer_icon} />
                    ) : (
                        <img src={penToSquareRegular} alt="" className={styles.footer_icon} />
                    )
                }
            </Link>
            <Link to="/">
                {activePage === 'index' ? (
                    <img src={userSolid} alt="" className={styles.footer_icon} />
                ) : (
                    <img src={userRegular} alt="" className={styles.footer_icon} />
                )}
            </Link>
            <Link to="/settings">
                <img src={listSolid} alt="" className={styles.footer_icon} />
            </Link>
        </footer>
    )
}

export default CommonFooter