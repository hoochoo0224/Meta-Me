import styles from './CommonHeader.module.scss'

const CommonHeader = () => {
    return (
        <header className={styles.header}>
            <img src="/src/assets/icons/hive-brands-solid.svg" alt="" className={styles.header_logo} />
            <span className={styles.header_title}>Meta Me</span>
        </header>
    )
}

export default CommonHeader