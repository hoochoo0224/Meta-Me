import CommonHeader from '@/components/common/header/CommonHeader';
import CommonFooter from '@/components/common/footer/CommonFooter';
import styles from './styles/index.module.scss';
import { useState } from 'react';
import { useEffect } from 'react';
import { contractAddress, deleteProfile, getTokenId, isProfileCreated } from '../contract';
import { Link } from 'react-router-dom';

export default function SettingsPage() {
  const [tokenId, setTokenId] = useState<string>('');
  const [account, setAccount] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedAccount = JSON.parse(localStorage.getItem('account'));
      setAccount(storedAccount);
    } catch (error) {
      console.error('계정 정보 파싱 오류:', error);
    }
  }, []);

  useEffect(() => {
    const checkProfile = async () => {
      if (account) {
        try {
          const result = await isProfileCreated(account);
          setHasProfile(result);
        } catch (error: any) {
          console.error('프로필 확인 중 오류:', error);
        }
      }
    };
    
    checkProfile();
  }, [account]);

  useEffect(() => {
    const fetchTokenId = async () => {
      if (account && hasProfile) {
        try {
          const result = await getTokenId(account);
          setTokenId(result.toString());
        } catch (error) {
          console.error('토큰 ID 가져오기 실패:', error);
        }
      }
    };

    fetchTokenId();
  }, [account, hasProfile]);

  const handleDeleteProfile = async () => {
    if (account && hasProfile) {
      try {
        setIsLoading(true);
        await deleteProfile(account);
        setHasProfile(false);
        setTokenId('');
      } catch (error) {
        console.error('프로필 삭제 중 오류:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

    return (
        <div className={styles.container}>
            <CommonHeader account={account} setAccount={setAccount} />
            {hasProfile ? (
                <>
                    <span className={styles.container_text}>컨트랙트 주소:<br />{contractAddress}<button className={styles.container_text_copy} onClick={() => copyToClipboard(contractAddress)}><img src="/src/assets/icons/copy-solid.svg" alt="복사" className={styles.container_text_copy_icon} /></button></span>
                    <span className={styles.container_text}>토큰 아이디: {tokenId}<button className={styles.container_text_copy} onClick={() => copyToClipboard(tokenId)}><img src="/src/assets/icons/copy-solid.svg" alt="복사" className={styles.container_text_copy_icon} /></button></span>
                    <button 
                        className={`${styles.container_button} ${styles.container_button_delete}`}
                        onClick={handleDeleteProfile}
                        disabled={isLoading}
                    >
                        {isLoading ? '삭제 중...' : '프로필 삭제'}
                    </button>
                </>
            ) : (
                <div className={styles.container_middle}>
                    <span className={styles.container_middle_text}>프로필이 없습니다. 프로필을 만들어보세요.</span>
                    <Link to="/create-profile" className={styles.container_middle_link}>프로필 만들러 가기</Link>
                </div>
            )}
            {!(!account || !hasProfile || isLoading) ? <CommonFooter activePage="settings" /> : null}
        </div>
    );
}