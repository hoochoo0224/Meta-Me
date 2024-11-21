import styles from './ProfileCard.module.scss'
import { forwardRef } from 'react'

const ProfileCard = forwardRef<HTMLDivElement, {profileImage: string,username: string, interests: string[], jobs: string[]}>((props, ref) => {
  return (
    <div ref={ref}>
      <div className={styles.profile}>
        <div className={styles.profile_image_container}>
          <img src={props.profileImage} alt="프로필 사진" className={styles.profile_image_container_image} />
        </div>

        <div className={styles.profile_info}>
          <h2 className={styles.profile_info_username}>{props.username}</h2>

        <div className={styles.profile_info_list}>
          <h3 className={styles.profile_info_list_title}>관심 분야</h3>

          <div className={styles.profile_info_list_list}>
            {props.interests.map((interest, index) => (
              <span className={styles.profile_info_list_list_item} key={index}>{interest}</span>
            ))}
          </div>
        </div>
        
        <div className={styles.profile_info_list}>
          <h3 className={styles.profile_info_list_title}>직업</h3>

          <div className={styles.profile_info_list_list}>
            {props.jobs.map((job, index) => (
              <span className={styles.profile_info_list_list_item} key={index}>{job}</span>
            ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default ProfileCard