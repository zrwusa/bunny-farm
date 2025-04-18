import {useEffect, useState} from 'react';
import {Query} from '@/types/generated/graphql';
import {getMeApolloGql} from '@/lib/api/client-actions';


export const useMe = () => {
    const [user, setUser] = useState<Query['me'] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMeApolloGql()
            .then((me) => {
                setUser(me);
            })
            .catch(() => {
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return {user, loading, isAuthenticated: !!user};
};
