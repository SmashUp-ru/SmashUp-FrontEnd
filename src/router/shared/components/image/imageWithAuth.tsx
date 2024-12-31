import { axiosSession } from '@/lib/utils.ts';
import { AxiosResponse } from 'axios';
import React, { useEffect } from 'react';

interface ImageWithAuthProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    image: string | undefined;
    setImage: React.Dispatch<React.SetStateAction<string | undefined>>;

    failed: boolean;
    setFailed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ImageWithAuth({
    src,
    alt,
    className,
    setImage,
    setFailed,
    image,
    failed,
    ...props
}: ImageWithAuthProps) {
    useEffect(() => {
        if (src) {
            axiosSession
                .get(src, {
                    responseType: 'blob'
                })
                .then((r: AxiosResponse<Blob>) => {
                    setImage(URL.createObjectURL(r.data));
                })
                .catch(() => setFailed(true));
        }
    }, [src]);

    if (!image) {
        if (!failed) {
            return <div className={className} />;
        } else {
            return <img alt={alt} {...props} />;
        }
    }

    return <img src={image} alt={alt} className={className} {...props} />;
}
