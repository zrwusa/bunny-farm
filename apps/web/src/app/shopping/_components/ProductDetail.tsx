import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {getProductApolloGql} from '@/lib/api/client-actions';
import {Query} from '@/types/generated/graphql';
import {Product} from '@/app/shopping/_types/product';
import {ProductDetailSkeleton} from '@/app/shopping/_components/product-detail-skeleton';
import {ProductDetailContent} from '@/app/shopping/_components/product-detail-content';
// ... rest of the file