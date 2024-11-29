import styles from './styles/index.module.scss'
import { useRef, useState, useEffect } from 'react'
import ProfileCard from './components/ProfileCard'
import CommonFooter from '@/components/common/footer/CommonFooter';
import CommonHeader from '@/components/common/header/CommonHeader';
import ConnectToMetamaskButton from './components/ConnectToMetamaskButton';
import { isProfileCreated } from '../contract';
import { Link } from 'react-router-dom';

function index() {
  const [account, setAccount] = useState<string | null>(null);
  const profileCardRef = useRef<HTMLDivElement>(null);
  const [hasProfile, setHasProfile] = useState<boolean>(false);

  useEffect(() => {
    const storedAccount = JSON.parse(localStorage.getItem('account'));
    setAccount(storedAccount);
  }, []);

  useEffect(() => {
    const checkProfile = async () => {
      if (account) {
        try {
          const result = await isProfileCreated(account);
          setHasProfile(Boolean(result));
        } catch (error: any) {
          console.error(error);
        }
      }
    };
    
    checkProfile();
  }, [account]);

  return (
    <div className={styles.container}>
      <CommonHeader account={account} setAccount={setAccount} />
      {account ? (
        hasProfile ? (
            <>
              <div className={styles.container_middle}>
                <ProfileCard ref={profileCardRef} account={account} hasProfile={hasProfile} />
              </div>
            </>
          ) : (
            <div className={styles.container_middle}>
              <span className={styles.container_middle_text}>프로필이 없습니다. 프로필을 만들어보세요.</span>
              <Link to="/create-profile" className={styles.container_middle_link}>프로필 만들러 가기</Link>
            </div>
          )
      ) : (
        <>
          <div className={styles.container_middle}>
            <ConnectToMetamaskButton setAccount={setAccount} />
          </div>
        </>
      )}
      {!(!account || !hasProfile) ?
        <CommonFooter activePage="index" />
      : null}
    </div>
  )
}

export default index