import { useState, useRef } from "react";
import styles from "./styles/index.module.scss";
import { Link } from "react-router-dom";
import CommonFooter from "@/components/common/footer/CommonFooter";

const MakeProfile = () => {
  // 프로필 이미지
  const [profileImage, setProfileImage] = useState<string>(() => {
    const savedImage = localStorage.getItem('profileImage');
    return savedImage || '/src/assets/images/image.png';
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setProfileImage(imageUrl);
        localStorage.setItem('profileImage', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // 유저 이름
  const [username, setUsername] = useState(() => {
    const savedUsername = localStorage.getItem('username');
    return savedUsername || "고주원";
  });
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    localStorage.setItem('username', e.target.value);
  };
  
  // 관심 분야 / 직업
  const [interests, setInterests] = useState<string[]>(() => {
    const savedInterests = localStorage.getItem('interests');
    return savedInterests ? JSON.parse(savedInterests) : ["웹 개발", "블록체인", "스마트 컨트랙트"];
  });
  const [jobs, setJobs] = useState<string[]>(() => {
    const savedJob = localStorage.getItem('jobs');
    return savedJob ? JSON.parse(savedJob) : ["프론트엔드 개발자"];
  });
  const handleListChange = (index: number, value: string, storageKey: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    const newList = [...list];
    newList[index] = value
    setList(newList);
    localStorage.setItem(storageKey, JSON.stringify(newList));
  };
  const handleListDelete = (index: number, storageKey: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
    localStorage.setItem(storageKey, JSON.stringify(newList));
  };
  const handleListAdd = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, storageKey: string) => {
    setList([...list, "new"]);
    localStorage.setItem(storageKey, JSON.stringify([...list, "new"]));
  };

  return (
    <div className={styles.container}>
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
            src={profileImage} 
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
                  <button className={styles.profile_info_list_list_item_container_delete_button} onClick={() => handleListDelete(index, 'interests', interests, setInterests)}>x</button>
                </div>
              ))}
              <button className={styles.profile_info_list_list_add_button} onClick={() => handleListAdd(interests, setInterests, 'interests')}>+</button>
            </div>
          </div>

          <div className={styles.profile_info_list}>
            <h3 className={styles.profile_info_list_title}>직업</h3>

            <div className={styles.profile_info_list_list}>
              {jobs.map((job, index) => (
                <div className={styles.profile_info_list_list_item_container} key={index}>
                  <input type="text" className={styles.profile_info_list_list_item_container_item} value={job} onChange={(e) => handleListChange(index, e.target.value, 'jobs', jobs, setJobs)} />
                  <button className={styles.profile_info_list_list_item_container_delete_button} onClick={() => handleListDelete(index, 'jobs', jobs, setJobs)}>x</button>
                </div>
              ))}
              <button className={styles.profile_info_list_list_add_button} onClick={() => handleListAdd(jobs, setJobs, 'jobs')}>+</button>
            </div>
          </div>
        </div>
      </div>
      <Link to="/">저장</Link>
      <CommonFooter />
    </div>
  );
};

export default MakeProfile;