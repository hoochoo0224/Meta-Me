import { useState, useRef, useEffect } from "react";
import styles from "./styles/index.module.scss";
import { Link } from "react-router-dom";
import CommonFooter from "@/components/common/footer/CommonFooter";
import CommonHeader from "@/components/common/header/CommonHeader";
import { setProfile, getProfile, isProfileCreated } from "../contract";
import minusIcon from '/src/assets/icons/minus-solid.svg'
import plusIcon from '/src/assets/icons/plus-solid.svg'

const MakeProfile = () => {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [interests, setInterests] = useState<string[]>([]);
  const [jobs, setJobs] = useState<string[]>([]);
  const [account, setAccount] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);

  useEffect(() => {
    const storedAccount = localStorage.getItem('account');
    if (storedAccount) {
      setAccount(JSON.parse(storedAccount));
    }
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

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoadingProfile(true);
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
      } finally {
        setIsLoadingProfile(false);
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
      setProfileImageUrl(URL.createObjectURL(profileImage));
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validatedUsername = e.target.value.replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎ]/g, '');
    setUsername(validatedUsername);
  };

  const handleListChange = (index: number, value: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    const newList = [...list];
    newList[index] = value.replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎ]/g, '');
    setList(newList);
  };

  const handleListDelete = (index: number, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleListAdd = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
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

      if (interests.length === 0 || interests.some(i => !i.trim())) {
        throw new Error('관심 분야 칸을 제대로 입력해주세요.');
      }

      if (jobs.length === 0 || jobs.some(j => !j.trim())) {
        throw new Error('직업 칸을 제대로 입력해주세요.');
      }

      await setProfile(account, profileImage, username, interests, jobs, []);
      alert('프로필이 성공적으로 수정되었습니다!');
    } catch (error: any) {
      console.error('handleSave:', error);
      alert(`프로필 수정에 실패했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
      URL.revokeObjectURL(profileImageUrl);
    }
  };

  return (
    <div className={styles.container}>
      <CommonHeader account={account} setAccount={setAccount} />
      {hasProfile ? (
        <div className={styles.container_middle}>
          {isLoadingProfile && (
            <div className={styles.loading_overlay}>
              <div className={styles.loading_spinner}></div>
              <p className={styles.loading_text}>프로필을 불러오는 중입니다...</p>
            </div>
          )}
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
                      onChange={(e) => handleListChange(index, e.target.value, interests, setInterests)}
                    />
                    <button className={styles.profile_info_list_list_item_container_delete_button} onClick={() => handleListDelete(index, interests, setInterests)}>
                      <img src={minusIcon} alt="삭제" className={styles.profile_info_list_list_item_container_delete_button_image} />
                    </button>
                  </div>
                ))}
                <button className={styles.profile_info_list_list_add_button} onClick={() => handleListAdd(interests, setInterests)} disabled={interests.length >= 7}>
                  <img src={plusIcon} alt="추가" className={styles.profile_info_list_list_add_button_image + (interests.length >= 7 ? " " + styles.profile_info_list_list_add_button_image_disabled : "")} />
                </button>
              </div>
            </div>

            <div className={styles.profile_info_list}>
              <h3 className={styles.profile_info_list_title}>직업</h3>

              <div className={styles.profile_info_list_list}>
                {jobs.map((job, index) => (
                  <div className={styles.profile_info_list_list_item_container} key={index}>
                    <input type="text" className={styles.profile_info_list_list_item_container_item} value={job} onChange={(e) => handleListChange(index, e.target.value, jobs, setJobs)} />
                    <button className={styles.profile_info_list_list_item_container_delete_button} onClick={() => handleListDelete(index, jobs, setJobs)}>
                      <img src={minusIcon} alt="삭제" className={styles.profile_info_list_list_item_container_delete_button_image} />
                    </button>
                  </div>
                ))}
                <button className={styles.profile_info_list_list_add_button} onClick={() => handleListAdd(jobs, setJobs)} disabled={jobs.length >= 3}>
                  <img src={plusIcon} alt="추가" className={styles.profile_info_list_list_add_button_image + (jobs.length >= 3 ? " " + styles.profile_info_list_list_add_button_image_disabled : "")} />
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
      {!(!account || isLoading || !hasProfile) ?
        <CommonFooter activePage="make-profile" />
      : null}
    </div>
  );
};

export default MakeProfile;