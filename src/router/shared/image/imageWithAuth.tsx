import { axiosSession } from '@/lib/utils';
import { AxiosResponse } from 'axios';
import React, { useEffect } from 'react';

interface ImageWithAuthProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    image: string | undefined;
    setImage: React.Dispatch<React.SetStateAction<string | undefined>>;

    failed: boolean;
    setFailed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ImageWithAuth(props: ImageWithAuthProps) {
    useEffect(() => {
        if (props.src) {
            axiosSession
                .get(props.src, {
                    responseType: 'blob'
                })
                .then((r: AxiosResponse<Blob>) => {
                    props.setImage(URL.createObjectURL(r.data));
                })
                .catch(() => props.setFailed(true));
        }
    }, []);

    if (!props.image) {
        if (!props.failed) {
            return <div className={props.className} />;
        } else {
            return <img {...props} />;
        }
    }

    return <img {...props} src={props.image} />;
}
