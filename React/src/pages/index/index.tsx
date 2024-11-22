import styles from './styles/index.module.scss'
import { useRef } from 'react'
import ProfileCard from './components/ProfileCard'
import CommonFooter from '@/components/common/footer/CommonFooter';
import CommonHeader from '@/components/common/header/CommonHeader';
import DownloadButton from './components/DownloadButton';
import ConnectToMetamaskButton from './components/ConnectToMetamaskButton';

function index() {
  const profileImage = localStorage.getItem('profileImage') || '/src/assets/images/image.png';
  const username = localStorage.getItem('username') || "고주원";
  const interests = localStorage.getItem('interests') ? JSON.parse(localStorage.getItem('interests') as string) : ["웹 개발", "블록체인", "스마트 컨트랙트"];
  const jobs = localStorage.getItem('jobs') ? JSON.parse(localStorage.getItem('jobs') as string) : ["프론트엔드 개발자"];

  const profileCardRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.container}>
      <CommonHeader />
      <div className={styles.container_bottom}>
        <ConnectToMetamaskButton />
      </div>
      <div className={styles.container_middle}>
        <ProfileCard ref={profileCardRef} profileImage={profileImage} username={username} interests={interests} jobs={jobs} />
      </div>
      <div className={styles.container_bottom}>
        <DownloadButton profileCardRef={profileCardRef} />
      </div>
      <CommonFooter activePage="index" />
    </div>
  )
}

export default index