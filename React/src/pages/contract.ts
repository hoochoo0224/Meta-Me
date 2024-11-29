export const contractAddress = '0x59651fE3e72ADa6Ce1ba633A20f83d058e3350E7';

const API_BASE_URL = 'https://port-0-meta-me-api-m3x1zrsv043003ce.sel4.cloudtype.app';

export const createProfile = async (account: string, file: File, name: string, interests: string[], jobs: string[], other: any[]): Promise<any> => {
    try {
        const formData = new FormData();
        formData.append('account', account);
        formData.append('file', file);
        formData.append('name', name);
        formData.append('interests', interests.join(','));
        formData.append('jobs', jobs.join(','));
        formData.append('other', JSON.stringify(other));

        const response = await fetch(`${API_BASE_URL}/api/create-profile`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('프로필 생성 실패');
        }

        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('createProfile error:', error);
        throw error;
    }
};

export const setProfile = async (account: string, file: File, name: string, interests: string[], jobs: string[], other: any[]): Promise<any> => {
    try {
        const formData = new FormData();
        formData.append('account', account);
        formData.append('file', file);
        formData.append('name', name);
        formData.append('interests', interests.join(','));
        formData.append('jobs', jobs.join(','));
        formData.append('other', JSON.stringify(other));

        const response = await fetch(`${API_BASE_URL}/api/set-profile`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('프로필 수정 실패');
        }

        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('setProfile error:', error);
        throw error;
    }
};

export const deleteProfile = async (account: string): Promise<any> => {
    try {
        const formData = new FormData();
        formData.append('account', account);

        const response = await fetch(`${API_BASE_URL}/api/delete-profile`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('프로필 삭제 실패');
        }

        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('deleteProfile error:', error);
        throw error;
    }
};

export const getProfile = async (account: string) => {
    try {
        const formData = new FormData();
        formData.append('account', account);

        const response = await fetch(`${API_BASE_URL}/api/get-profile`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('프로필 조회 실패');
        }
        
        const data = await response.json();
        const attributes = data.result.attributes;
            return {
                profileImage: attributes.find(attr => attr.trait_type === "Profile Image")?.value,
                username: attributes.find(attr => attr.trait_type === "Name")?.value,
                interests: attributes.find(attr => attr.trait_type === "Interests")?.value.split(','),
                jobs: attributes.find(attr => attr.trait_type === "Jobs")?.value.split(',')
            };
    } catch (error) {
        console.error('getProfile error:', error);
        throw error;
    }
};

export const isProfileCreated = async (account: string): Promise<boolean> => {
    try {
        const formData = new FormData();
        formData.append('account', account);

        const response = await fetch(`${API_BASE_URL}/api/is-profile-created`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('프로필 존재 여부 확인 실패');
        }

        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('isProfileCreated error:', error);
        throw error;
    }
};

export const getTokenId = async (account: string): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append('account', account);

        const response = await fetch(`${API_BASE_URL}/api/get-token-id`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('토큰 ID 조회 실패');
        }

        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('getTokenId error:', error);
        throw error;
    }
};