import styles from './styles/index.module.scss';
import { createProfile } from '../contract';
import { useState, useEffect } from 'react';
import CommonHeader from '@/components/common/header/CommonHeader';

export default function CreateProfilePage() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [account, setAccount] = useState<string | null>(null);

    useEffect(() => {
        const storedAccount = JSON.parse(localStorage.getItem('account'));
        setAccount(storedAccount);
    }, []);

    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState('');
    const [interests, setInterests] = useState<string>('');
    const [jobs, setJobs] = useState<string>('');

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (!window.ethereum) {
                throw new Error('메타마스크가 설치되어 있지 않습니다.');
            }
            if (!account) {
                throw new Error('메타마스크 연결 후 다시 시도해 주세요.');
            }
            if (!file) {
                throw new Error('프로필 이미지를 선택해주세요.');
            }
            if (!name) {
                throw new Error('이름을 입력해주세요.');
            }
            if (!interests || interests.split(',').length < 1) {
                throw new Error('관심사를 최소 1개 이상 입력해야합니다..');
            } else if (interests.split(',').length > 7) {
                throw new Error('관심사는 최대 7개까지 입력할 수 있습니다.');
            }
            if (!jobs || jobs.split(',').length < 1) {
                throw new Error('직업을 최소 1개 이상 입력해야합니다.');
            } else if (jobs.split(',').length > 3) {
                throw new Error('직업은 최대 3개까지 입력할 수 있습니다.');
            }
            await createProfile(account, file, name, interests.split(","), jobs.split(","), []);
        } catch (error: any) {
            console.error(error);
            alert(error.message);
            throw error;
        } finally {
            setIsLoading(false);
            window.location.href = '/';
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] || null);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInterests(e.target.value);
    };

    const handleJobsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJobs(e.target.value);
    };

    return (
        <div className={styles.container}>
            <CommonHeader account={account} setAccount={setAccount} />
            {isLoading ? (
                <div className={styles.loading_overlay}>
                    <div className={styles.loading_spinner}></div>
                    <p className={styles.loading_text}>프로필을 생성하는 중입니다...</p>
                </div>
            ) : (
                <>
                    <h2>프로필 생성</h2>
                    <div className={styles.container_form}>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        <input type="text" placeholder="이름" onChange={handleNameChange} />
                        <input type="text" placeholder="관심사 (','로 구분)" onChange={handleInterestsChange} />
                        <input type="text" placeholder="직업 (','로 구분)" onChange={handleJobsChange} />
                        <button onClick={handleSubmit}>프로필 생성</button>
                    </div>
                </>
            )}
        </div>
    );
}