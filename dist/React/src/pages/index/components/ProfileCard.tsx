import { getProfile } from '@/pages/contract';
import styles from './ProfileCard.module.scss'
import { forwardRef, useEffect, useState } from 'react'

const ProfileCard = forwardRef<HTMLDivElement, {account: string, hasProfile: boolean}>((props, ref) => {
  const [profileData, setProfileData] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (props.account && props.hasProfile) {
        try {
          setIsLoading(true);
          const profile = await getProfile(props.account);
          setProfileData({
            profileImage: profile.profileImage,
            username: profile.username,
            interests: profile.interests,
            jobs: profile.jobs
          });
        } catch (error) {
          console.error('프로필 가져오기 실패:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
  
    fetchProfile();
  }, [props.account, props.hasProfile]);

  return (
    <div ref={ref}>
      {isLoading ? (
        <div className={styles.loading_overlay}>
          <div className={styles.loading_spinner}></div>
          <p className={styles.loading_text}>프로필을 불러오는 중입니다...</p>
        </div>
      ) : (
        <div className={styles.profile}>
          <div className={styles.profile_image_container}>
            <img src={profileData?.profileImage} alt="프로필 사진" className={styles.profile_image_container_image} />
          </div>

          <div className={styles.profile_info}>
            <h2 className={styles.profile_info_username}>{profileData?.username}</h2>

          <div className={styles.profile_info_list}>
            <h3 className={styles.profile_info_list_title}>관심 분야</h3>

            <div className={styles.profile_info_list_list}>
              {profileData?.interests.map((interest, index) => (
                <span className={styles.profile_info_list_list_item} key={index}>{interest}</span>
              ))}
            </div>
          </div>
          
          <div className={styles.profile_info_list}>
            <h3 className={styles.profile_info_list_title}>직업</h3>

            <div className={styles.profile_info_list_list}>
              {profileData?.jobs.map((job, index) => (
                <span className={styles.profile_info_list_list_item} key={index}>{job}</span>
              ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default ProfileCard