import { queryProfileDetails } from '@/lib/supabaseQuery';
import { defaultKeywordMap, keywordMapType, Profile } from '@/utils/types';
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type ProfileContextType = {
    profile: Profile;
    keywordMap: keywordMapType;
    refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

type ProfileProviderProps = {
    children: ReactNode;
    userId: string;
};

const convertKeywordMap = (categoryFilter: string | undefined): keywordMapType => {
    let keywordMap: keywordMapType = new Map(Object.entries(defaultKeywordMap))
    if (categoryFilter) {
        try {
            const obj = categoryFilter as Object
            const newMap = new Map<string, string[]>()
            for (const [category, keywords] of Object.entries(obj)) {
                newMap.set(category, keywords)
            }
            keywordMap = newMap            
        } catch {
            undefined
        }
    }
    return keywordMap
}

export const ProfileProvider = ({ children, userId }: ProfileProviderProps) => {
    const [profile, setProfile] = useState<Profile>({ user_id: userId })
    const [keywordMap, setKeywordMap] = useState<keywordMapType>(new Map())

    const refreshProfile = async () => {
        const newProfile = await queryProfileDetails(userId)
        setProfile(newProfile)
        setKeywordMap(convertKeywordMap(newProfile.category_filter))
    };

    useEffect(() => {
        refreshProfile()
    }, [])

    return (
        <ProfileContext.Provider value={{ profile, keywordMap, refreshProfile }}>
            {children}
        </ProfileContext.Provider>
    )
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a UserProvider in Dashboard');
    }
    return context;
};

