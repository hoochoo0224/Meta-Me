import { useState, useRef, useEffect } from "react";
import styles from "./styles/index.module.scss";
import { Link } from "react-router-dom";
import CommonFooter from "@/components/common/footer/CommonFooter";
import CommonHeader from "@/components/common/header/CommonHeader";
import { setProfile, getProfile, isProfileCreated } from "../contract";

const MakeProfile = () => {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [interests, setInterests] = useState<string[]>([]);
  const [jobs, setJobs] = useState<string[]>([]);
  const [account, setAccount] = useState<string | null>(JSON.parse(localStorage.getItem('account')));
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (account) {
        try {
          const result = await isProfileCreated(account);
          setHasProfile(result);
          console.log(hasProfile);
          console.log(account);
        } catch (error: any) {
          console.error(error);
        }
      }
    };
    
    checkProfile();
  }, [account]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getProfile(account);

        if (profile.profileImage) {
          const response = await fetch(profile.profileImage);
          const blob = await response.blob();
          const fileName = profile.profileImage.split('/').pop() || 'profile.jpg';
          const file = new File([blob], fileName, { type: blob.type });
          
          setProfileImage(file);
          setProfileImageUrl(profile.profileImage);
        }

        if (profile.username) setUsername(profile.username);
        if (profile.interests) setInterests(profile.interests);
        if (profile.jobs) setJobs(profile.jobs);
      } catch (error: any) {
        console.error('프로필 로드 실패:', error);
      }
    };
    
    if (account && hasProfile) {
      loadProfile();
    }
  }, [account, hasProfile]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validatedUsername = e.target.value.replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎ]/g, '');
    setUsername(validatedUsername);
  };

  const handleListChange = (type, index: number, value: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    const newList = [...list];
    newList[index] = value.replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎ]/g, '');
    setList(newList);
  };

  const handleListDelete = (type, index: number, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleListAdd = (type, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    const newList = [...list, "new"];
    setList(newList);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      if (!account) {
        throw new Error('메타마스크 연결 후 다시 시도해 주세요.');
      }
      
      if (!profileImage) {
        throw new Error('프로필 이미지를 선택해주세요.');
      }

      if (!username.trim()) {
        throw new Error('이름을 입력해주세요.');
      }

      if (interests.length === 0) {
        throw new Error('최소 하나의 관심 분야를 입력해야합니다.');
      }

      if (jobs.length === 0) {
        throw new Error('최소 하나의 직업을 입력해야합니다.');
      }

      await setProfile(account, profileImage, username, interests.join(','), jobs.join(','), []);
      alert('프로필이 성공적으로 수정되었습니다!');
    } catch (error: any) {
      console.error('프로필 수정 실패:', error);
      alert(`프로필 수정에 실패했습니다: ${error.message}`);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <div className={styles.container}>
      <CommonHeader account={account} setAccount={setAccount} />
      {hasProfile ? (
        <div className={styles.container_middle}>
          {isLoading && (
            <div className={styles.loading_overlay}>
              <div className={styles.loading_spinner}></div>
              <p className={styles.loading_text}>프로필을 저장하는 중입니다...</p>
            </div>
          )}
          <div className={styles.profile}>
            <div className={styles.profile_image_container} onClick={() => fileInputRef.current?.click()}>
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              hidden
            />
            <img 
              src={profileImageUrl} 
              alt="프로필 사진" 
              className={styles.profile_image_container_image}
            />
          </div>

          <div className={styles.profile_info}>
            <input type="text" className={styles.profile_info_username} placeholder={username} value={username} onChange={handleUsernameChange} />

            <div className={styles.profile_info_list}>
              <h3 className={styles.profile_info_list_title}>관심 분야</h3>

              <div className={styles.profile_info_list_list}>
                {interests.map((interest, index) => (
                  <div className={styles.profile_info_list_list_item_container} key={index}>
                    <input 
                      type="text"
                      className={styles.profile_info_list_list_item_container_item}
                      value={interest}
                      onChange={(e) => handleListChange(index, e.target.value, 'interests', interests, setInterests)}
                    />
                    <button className={styles.profile_info_list_list_item_container_delete_button} onClick={() => handleListDelete(index, 'interests', interests, setInterests)}>
                      <img src="/src/assets/icons/minus-solid.svg" alt="삭제" className={styles.profile_info_list_list_item_container_delete_button_image} />
                    </button>
                  </div>
                ))}
                <button className={styles.profile_info_list_list_add_button} onClick={() => handleListAdd('interests', interests, setInterests)} disabled={interests.length >= 7}>
                  <img src="/src/assets/icons/plus-solid.svg" alt="추가" className={styles.profile_info_list_list_add_button_image + (interests.length >= 7 ? " " + styles.profile_info_list_list_add_button_image_disabled : "")} />
                </button>
              </div>
            </div>

            <div className={styles.profile_info_list}>
              <h3 className={styles.profile_info_list_title}>직업</h3>

              <div className={styles.profile_info_list_list}>
                {jobs.map((job, index) => (
                  <div className={styles.profile_info_list_list_item_container} key={index}>
                    <input type="text" className={styles.profile_info_list_list_item_container_item} value={job} onChange={(e) => handleListChange(index, e.target.value, 'jobs', jobs, setJobs)} />
                    <button className={styles.profile_info_list_list_item_container_delete_button} onClick={() => handleListDelete(index, 'jobs', jobs, setJobs)}>
                      <img src="/src/assets/icons/minus-solid.svg" alt="삭제" className={styles.profile_info_list_list_item_container_delete_button_image} />
                    </button>
                  </div>
                ))}
                <button className={styles.profile_info_list_list_add_button} onClick={() => handleListAdd('jobs', jobs, setJobs)} disabled={jobs.length >= 3}>
                  <img src="/src/assets/icons/plus-solid.svg" alt="추가" className={styles.profile_info_list_list_add_button_image + (jobs.length >= 3 ? " " + styles.profile_info_list_list_add_button_image_disabled : "")} />
                </button>
              </div>
            </div>
          </div>
          <div className={styles.button_container}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <button 
                className={styles.container_save_button} 
                onClick={(e) => {
                  e.preventDefault();
                  handleSave().then(() => {
                    window.location.href = '/';
                  });
                }}
              >
                저장
              </button>
            </Link>
          </div>
        </div>
      </div>
      ) : (
        <div className={styles.container_middle}>
          <span className={styles.container_middle_text}>프로필이 없습니다. 프로필을 만들어보세요.</span>
          <Link to="/create-profile" className={styles.container_middle_link}>프로필 만들러 가기</Link>
        </div>
      )}
      {account || !isLoading || hasProfile ?
        <CommonFooter activePage="make-profile" />
      : null}
    </div>
  );
};

export default MakeProfile;