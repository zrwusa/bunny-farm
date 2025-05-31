import {useContext} from 'react';
import {ListSizeContext} from '@/contexts/list-size-context';

export const useListSize = () => {
    const listSizeContext = useContext(ListSizeContext);
    if (listSizeContext === undefined) throw new Error('useListSize must be used within a ListSizeProvider')
    return listSizeContext;
}