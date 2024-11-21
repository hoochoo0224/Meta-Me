import styles from './styles/index.module.scss'
import { useRef, useCallback } from 'react'
import { toPng } from 'html-to-image';
import ProfileCard from './components/ProfileCard'
import CommonFooter from '@/components/common/footer/CommonFooter';
import CommonHeader from '@/components/common/header/CommonHeader';

function index() {
  const profileImage = localStorage.getItem('profileImage') || '/src/assets/images/image.png';
  const username = localStorage.getItem('username') || "고주원";
  const interests = localStorage.getItem('interests') ? JSON.parse(localStorage.getItem('interests') as string) : ["웹 개발", "블록체인", "스마트 컨트랙트"];
  const jobs = localStorage.getItem('jobs') ? JSON.parse(localStorage.getItem('jobs') as string) : ["프론트엔드 개발자"];

  // 다운로드
  const profileCardRef = useRef<HTMLDivElement>(null);

  const onButtonClick = useCallback(() => {
    if (profileCardRef.current === null) {
      return
    }

    toPng(profileCardRef.current, { cacheBust: true, })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'your-profile.png'
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [profileCardRef])

  return (
    <div className={styles.container}>
      <CommonHeader />
      <div className={styles.container_middle}>
        <ProfileCard ref={profileCardRef} profileImage={profileImage} username={username} interests={interests} jobs={jobs} />
      </div>
      <div className={styles.container_bottom}>
        <button onClick={onButtonClick} className={styles.container_bottom_download}>
          <img src="/src/assets/icons/download-solid.svg" alt="다운로드" />
        </button>
      </div>
      <CommonFooter activePage="index" />
    </div>
  )
}

export default index