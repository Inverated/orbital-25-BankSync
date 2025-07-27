import "@testing-library/jest-dom";
import { beforeEach } from '@jest/globals';
import { cleanup } from '@testing-library/react';

beforeEach(() => {
  cleanup(); // Clear DOM and components
});

jest.mock('@/context/UserContext', () => ({
    useUserId: () => ({
        userId: 'User ID',
    }),
}));

jest.mock('@/context/ProfileContext', () => ({
    useProfile: () => ({
        profile: { user_name: "mock name" },
        //keywordMap: new Map(Object.entries(defaultKeywordMap)),
        keywordMap: [],
        refreshProfile: jest.fn(),
        refreshStatus: true,
    }),
}));

jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn()
}));

jest.mock('@/lib/supabase', () => ({
    supabase: {
        from: jest.fn(() => ({
            upsert: jest.fn().mockResolvedValue({
                error: null
            })
        })),
        auth: {
            getSession: jest.fn().mockResolvedValue({
                data: { session: { user: { id: 'mock id' } } },
                error: null,
            }),
            updateUser: jest.fn().mockResolvedValue({
                error: null,
            }),
            signOut: jest.fn().mockResolvedValue({
                error: null,
            }),
            getUser: jest.fn().mockResolvedValue({
                data: {
                    user: {
                        app_metadata: { providers: ['google'] }
                    }
                }
            })
        },
    },
}));

jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
    useRouter: jest.fn(() => ({
        push: jest.fn()
    }))
}));
