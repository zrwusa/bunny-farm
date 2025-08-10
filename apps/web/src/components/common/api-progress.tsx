'use client'

import {Progress} from '@/components/ui/progress';
import {useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import {useEffect, useState} from 'react';

const ApiProgress = () => {
    const {loading} = useSelector((state: RootState) => state.apiState)
    const [progress, setProgress] = useState(10)

    useEffect(() => {
        const timer = setTimeout(() => {
            if (loading) setProgress(66);
            else setProgress(100)
        }, 200)
        return () => clearTimeout(timer)
    }, [loading])

    return <Progress value={progress} className="w-full h-1"/>
};

export default ApiProgress;
